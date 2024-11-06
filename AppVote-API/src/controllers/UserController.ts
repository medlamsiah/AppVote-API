import { Request, Response } from 'express';
import { UsersService } from '../services';
import { validationResult } from 'express-validator';

export class UserController {
  private usersService: UsersService;

  constructor(usersService: UsersService) {
    this.usersService = usersService;
  }

  async createUser(request: Request, response: Response): Promise<void> {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      response.status(400).json({
        status: 400,
        message: 'Bad request.',
        data: errors.array(),
      });
    } else {
      try {
        const { email, password, username } = request.body;

        const userData = { email, password, username };

        const userResponse = await this.usersService.createUser(userData);

        response.status(userResponse.status).send({
          ...userResponse,
        });
      } catch (error) {
        response.status(500).json({
          status: 500,
          message: 'Internal server error',
          data: error
        })
      }
    }
  }
async deleteUser(request: Request, response: Response): Promise<void> {
    try {
      const userId = request.params.id;

      if (!userId) {
        response.status(400).json({
          status: 400,
          message: 'User ID is required'
        });
        return;
      }

      const userResponse = await this.usersService.deleteUserById(userId);

      response.status(userResponse.status).send({
        ...userResponse,
      });
    } catch (error) {
      response.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: error
      });
    }
  }

  async getUsers(request: Request, response: Response): Promise<void> {
    try {
      const usersResponse = await this.usersService.getUsers();

      response.status(usersResponse.status).send({
        ...usersResponse,
      });
    } catch (error) {
      response.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: error
      })
    }
  }
  async updateMyData(request: Request, response: Response): Promise<any> {
    try {
        const userId = request.userId;
        const updatedData = request.body; 
        if (!userId) {
            return response.status(404).json({
                status: 404,
                message: 'User ID not provided'
            });
        }
        const userResponse = await this.usersService.getUserById(userId);
        
        if (userResponse.status !== 200 || !userResponse.data) {
            return response.status(404).json({
                status: 404,
                message: 'User not found'
            });
        }

        const modifiedUserData = {
            ...userResponse.data,      
            ...updatedData,             
            updatedAt: new Date()      
        };

        // Step 4: Save the modified user data back to the database
        await this.usersService.updateUserById(userId, modifiedUserData);

        // Step 5: Send a success response
        response.status(200).json({
            status: 200,
            message: 'User data updated successfully!',
            data: modifiedUserData
        });
    } catch (error) {
        response.status(500).json({
            status: 500,
            message: 'Internal server error',
            data: error
        });
    }
}

async updatePassword(request: Request, response: Response): Promise<any> {
    try {
        const userId = request.userId;
        const { currentPassword, newPassword } = request.body;

        if (!userId) {
            return response.status(404).json({
                status: 404,
                message: 'User ID not provided'
            });
        }

        if (!currentPassword || !newPassword) {
            return response.status(400).json({
                status: 400,
                message: 'Current password and new password are required'
            });
        }

        const userResponse = await this.usersService.getUserById(userId);
        
        if (userResponse.status !== 200 || !userResponse.data) {
            return response.status(404).json({
                status: 404,
                message: 'User not found'
            });
        }

        // Verify current password
        const isPasswordValid = await this.usersService.updatePassword(userId, currentPassword, newPassword);
        if (!isPasswordValid) {
            return response.status(401).json({
                status: 401,
                message: 'Current password is incorrect'
            });
        }

        response.status(200).json({
            status: 200,
            message: 'Password updated successfully!'
        });
    } catch (error) {
        response.status(500).json({
            status: 500,
            message: 'Internal server error',
            data: error
        });
    }
}
async updateUserById(request: Request, response: Response): Promise<any> {
  try {
      const userId = request.params.id;
      const updatedData = request.body; 
      if (!userId) {
          return response.status(404).json({
              status: 404,
              message: 'User ID not provided'
          });
      }
      const userResponse = await this.usersService.getUserById(userId);
      
      if (userResponse.status !== 200 || !userResponse.data) {
          return response.status(404).json({
              status: 404,
              message: 'User not found'
          });
      }

      const modifiedUserData = {
          ...userResponse.data,      
          ...updatedData,             
          updatedAt: new Date()      
      };

      // Step 4: Save the modified user data back to the database
      await this.usersService.updateUserById(userId, modifiedUserData);

      // Step 5: Send a success response
      response.status(200).json({
          status: 200,
          message: 'User data updated successfully!',
          data: modifiedUserData
      });
  } catch (error) {
      response.status(500).json({
          status: 500,
          message: 'Internal server error',
          data: error
      });
  }
}
  async getUserById(request: Request, response: Response): Promise<void> {
    try {
      if (request.params.id) {
        const usersResponse = await this.usersService.getUserById(request.params.id);

        response.status(usersResponse.status).send({
          ...usersResponse,
        });
      } else {
        response.status(404).json({
          status: 404,
          message: 'User not found'
        });
      }
    } catch (error) {
      response.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: error
      })
    }
  }
  async getMyDataById(request: Request, response: Response): Promise<void> {
    try {
      if (request.params.id) {
        const usersResponse = await this.usersService.getMyDataById(request.params.id);

        response.status(usersResponse.status).send({
          ...usersResponse,
        });
      } else {
        response.status(404).json({
          status: 404,
          message: 'User not found'
        });
      }
    } catch (error) {
      response.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: error
      })
    }
  }

  async login(request: Request, response: Response): Promise<void> {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      response.status(400).json({
        status: 400,
        message: 'Bad request.',
        data: errors.array(),
      });
    } else {
      try {
        const { email, password } = request.body;
        const userData = { email, password };

        const userResponse = await this.usersService.login(userData);

        response.status(userResponse.status).json({
          ...userResponse
        });
      } catch (error) {
        response.status(500).json({
          status: 500,
          message: 'Internal server error',
          data: error
        })
      }
    }
  }
}
