/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HexabaseService {
  private readonly baseUrl = process.env.HEXABASE_API_URL;

  constructor(private readonly httpService: HttpService) {}

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
    console.error(error.response?.data || error.message);
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
      console.log(this.baseUrl);
      const response = await firstValueFrom(
        this.httpService.post(`https://api.hexabase.com/api/v0/login`, {
          user_code: username,
          password: password,
        }),
      );
      console.log(response);
      return response.data.token;
    } catch (error) {
      throw this.handleError(error, 'Đăng nhập Hexabase thất bại');
    }
  }

  async getUserInfo(token: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/userinfo`, {
          headers: this.getHeaders(token),
        }),
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Không thể lấy thông tin user từ Hexabase');
    }
  }

  async createItem(
    projectId: string,
    datastoreId: string,
    payload: any,
    token: string,
  ) {
    try {
      const url = `${this.baseUrl}/applications/${projectId}/datastores/${datastoreId}/items/new`;
      const response = await firstValueFrom(
        this.httpService.post(
          url,
          { item: payload }, // Payload dữ liệu
          { headers: this.getHeaders(token) }, // Nhét token vào đây
        ),
      );
      return response.data;
    } catch (error) {
      this.handleError(error, 'Không thể tạo dữ liệu mới trên Hexabase');
    }
  }
}
