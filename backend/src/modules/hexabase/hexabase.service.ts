/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import FormData from 'form-data';

@Injectable()
export class HexabaseService {
  checkDepartmentExists: any;
  checkUserExists: any;
  checkRoleExists: any;
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
        error.response.data,
      );
    }
    return new HttpException(
      'Error when calling Hexabase',
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
      throw this.handleError(error, 'Login to Hexabase failed');
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
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log('Đã xảy ra lỗi không xác định:', error);
      }
    }
  }

  async getItemDetail(
    projectId: string,
    datastoreId: string,
    itemId: string,
    token: string,
  ) {
    try {
      const url = `${this.baseUrl}applications/${projectId}/datastores/${datastoreId}/items/details/${itemId}`;
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: this.getHeaders(token),
        }),
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Can not get item detail from Datastore');
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
      throw this.handleError(error, 'Can not get user info from Hexabase');
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
      throw this.handleError(error, 'Can not create user on Workspace');
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
          { item: payload, use_display_id: true, return_item_result: true },
          { headers: this.getHeaders(token) },
        ),
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Can not save data to Datastore');
    }
  }

  async searchItems(
    projectId: string,
    datastoreId: string,
    token: string,
    page = 1,
    perPage = 1000,
    conditions?: any,
  ) {
    try {
      const url = `${this.baseUrl}applications/${projectId}/datastores/${datastoreId}/items/search`;

      const payload: any = {
        page: page,
        per_page: perPage,
        use_display_id: true,
      };

      if (conditions && conditions.length > 0) {
        payload.conditions = conditions;
      }

      const response = await firstValueFrom(
        this.httpService.post(url, payload, {
          headers: this.getHeaders(token),
        }),
      );

      return {
        items: response.data.items ?? [],
        total: response.data.totalItems ?? 0,
      };
    } catch (error) {
      throw this.handleError(error, 'Can not get data from Datastore');
    }
  }

  async updateItem(
    projectId: string,
    datastoreId: string,
    itemId: string,
    payload: any,
    token: string,
    revNo?: number,
  ) {
    const body: any = {
      item: payload,
      use_display_id: true,
      return_item_result: true,
    };

    if (typeof revNo === 'number') {
      body.rev_no = revNo;
    } else {
      body.is_force_update = true;
    }

    const response = await firstValueFrom(
      this.httpService.post(
        `${this.baseUrl}applications/${projectId}/datastores/${datastoreId}/items/edit/${itemId}`,
        body,
        { headers: this.getHeaders(token) },
      ),
    );

    return response.data;
  }

  async deleteItem(
    projectId: string,
    datastoreId: string,
    itemId: string,
    token: string,
  ) {
    try {
      const url = `${this.baseUrl}applications/${projectId}/datastores/${datastoreId}/items/delete/${itemId}`;
      const response = await firstValueFrom(
        this.httpService.delete(url, {
          headers: this.getHeaders(token),
          data: {},
        }),
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Can not delete item from Datastore');
    }
  }

  async removeWorkspaceUser(
    g_id: string,
    u_id: string,
    token: string,
    w_id?: string,
  ) {
    try {
      const payload: any = { g_id, u_id };
      if (w_id) payload.w_id = w_id;
      const response = await firstValueFrom(
        this.httpService.delete(`${this.baseUrl}users`, {
          headers: this.getHeaders(token),
          data: payload,
        }),
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Can not remove user from workspace');
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
      throw this.handleError(error, 'Can not change password');
    }
  }

  async getAutoNumber(
    projectId: string,
    datastoreId: string,
    fieldId: string,
    token: string,
  ) {
    try {
      const url = `${this.baseUrl}applications/${projectId}/datastores/${datastoreId}/fields/${fieldId}/autonum`;

      const response = await firstValueFrom(
        this.httpService.post(url, {}, { headers: this.getHeaders(token) }),
      );

      // API Hexabase thường trả về { "autonumber": "KONOHA-..." }
      return response.data.result.value;
    } catch (error) {
      throw this.handleError(error, 'Can not get AutoNumber from Hexabase');
    }
  }

  async uploadFile(file: Express.Multer.File, token: string) {
    try {
      const url = `${this.baseUrl}files`;

      const formData = new FormData();
      formData.append('file', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      });

      const headers = {
        Authorization: `Bearer ${token}`,
        ...formData.getHeaders(),
      };
      console.log('--- ĐANG GỬI FILE LÊN HEXABASE (/files) ---');

      const response = await firstValueFrom(
        this.httpService.post(url, formData, { headers }),
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Không thể upload file lên Hexabase');
    }
  }

  async downloadFile(fileId: string, token: string): Promise<Buffer> {
    try {
      const url = `${this.baseUrl}files/${fileId}`;

      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: this.getHeaders(token),
          responseType: 'arraybuffer',
        }),
      );

      return Buffer.from(response.data as ArrayBuffer);
    } catch (error) {
      throw this.handleError(error, 'Không thể download file từ Hexabase');
    }
  }
}
