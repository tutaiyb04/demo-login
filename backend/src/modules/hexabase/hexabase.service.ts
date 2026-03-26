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
      return new HttpException(
        error.response.data.error || defaultMessage,
        error.response.status,
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
      const userPayload = {
        email: userData.email,
        password: userData.password,
        user_code: userData.username,
        name: `${userData.lastName} ${userData.firstName}`.trim(),
      };

      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}users`,
          { user: userPayload },
          { headers: this.getHeaders(token) },
        ),
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
}
