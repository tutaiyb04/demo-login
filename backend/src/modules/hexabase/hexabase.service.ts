/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HexabaseService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private get baseUrl(): string {
    return this.configService.get<string>('HEXABASE_API_URL') || '';
  }

  private getHeaders(token?: string) {
    const headers: any = { 'Content-Type': 'application/json' };
    if (token) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      headers['Authorization'] = `Bearer ${token}`;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return headers;
  }

  private handleError(error: any, defaultMessage: string): HttpException {
    if (error.response) {
      console.log('--- HEXABASE ERROR START ---');
      console.log('url:', error.config?.url);
      console.log('method:', error.config?.method);
      console.log('request_data:', error.config?.data);
      console.log('status:', error.response?.status);
      console.log('response_data:', error.response?.data);
      console.log('--- HEXABASE ERROR END ---');

      return new HttpException(
        error.response.data.error || defaultMessage,
        error.response.status,
        error.response.data,
      );
    }
    return new HttpException(
      'Lỗi hệ thống khi gọi Hexabase',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  async login(username: string, password: string): Promise<string> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}login`, {
          user_code: username,
          password: password,
        }),
      );

      return response.data.token;
    } catch (error) {
      throw this.handleError(error, 'Đăng nhập Hexabase thất bại');
    }
  }

  async logout(token: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}logout`,
          {},
          { headers: this.getHeaders(token) },
        ),
      );

      return response.data;
    } catch (error) {
      console.error('Hexabase logout error', error.message);
    }
  }

  async getUserInfo(token: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}userinfo`, {
          headers: this.getHeaders(token),
        }),
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Không thể lấy thông tin user từ Hexabase');
    }
  }

  async createWorkspaceUser(userData: any, token: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}users`,
          {
            email: userData.email,
            g_id: userData.g_id,
            username: userData.firstName,
            user_code: userData.username,
            no_confirm_email: true,
            tmp_password: userData.password,
          },
          { headers: this.getHeaders(token) },
        ),
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Không thể tạo tài khoản trên Workspace');
    }
  }

  async addUserToWorkspace(
    workspaceId: string,
    payload: {
      email: string;
      g_id: string;
      username?: string;
      user_code?: string;
      tmp_password?: string;
      no_confirm_email?: boolean;
      send_password_to_email?: boolean;
    },
    token: string,
  ) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}workspaces/${workspaceId}/users`,
          { users: [payload] },
          { headers: this.getHeaders(token) },
        ),
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Không thể thêm user vào workspace/group');
    }
  }

  async changePassword(
    oldPassword: string,
    newPassword: string,
    token: string,
  ) {
    try {
      const response = await firstValueFrom(
        this.httpService.put(
          `${this.baseUrl}users/password`,
          {
            old_password: oldPassword,
            new_password: newPassword,
            confirm_password: newPassword,
          },
          { headers: this.getHeaders(token) },
        ),
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Không thể đổi mật khẩu');
    }
  }
  async forgotPasswordRequest(email: string, userCode?: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}users/password/forgot`, {
          email,
          user_code: userCode,
        }),
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Không thể gửi yêu cầu reset mật khẩu');
    }
  }

  async createItem(
    projectId: string,
    datastoreId: string,
    payload: any,
    token: string,
  ) {
    try {
      const url = `${this.baseUrl}applications/${projectId}/datastores/${datastoreId}/items/new`;
      const response = await firstValueFrom(
        this.httpService.post(
          url,
          { item: payload },
          { headers: this.getHeaders(token) },
        ),
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Không thể lưu dữ liệu vào Datastore');
    }
  }
}
