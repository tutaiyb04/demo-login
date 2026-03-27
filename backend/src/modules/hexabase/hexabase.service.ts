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

  async createWorkspaceUser(
    email: string,
    g_id: string,
    username: string,
    user_code: string,
    tmp_password: string,
    invitor_id: string,
    token: string,
  ) {
    try {
      const payload = {
        email,
        g_id,
        username,
        user_code,
        no_confirm_email: true,
        tmp_password,
        invitor_id,
      };

      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}users`, payload, {
          headers: this.getHeaders(token),
        }),
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Không thể tạo tài khoản trên Workspace');
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

  async searchItems(projectId: string, datastoreId: string, token: string) {
    try {
      const url = `${this.baseUrl}applications/${projectId}/datastores/${datastoreId}/items/search`;
      const response = await firstValueFrom(
        this.httpService.post(
          url,
          {
            page: 1,
            per_page: 100,
            use_display_id: true,
          },
          { headers: this.getHeaders(token) },
        ),
      );
      return response.data.items;
    } catch (error) {
      throw this.handleError(error, 'Không thể lấy danh sách từ Datastore');
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
}
