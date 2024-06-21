declare type DbType = 'mysql' | 'postgres' | 'mssql';

declare type envData = {
  username?: string;
  password?: string;
  host?: string;
  port?: string;
  name?: string;
  type: DbType;
};

interface ReturnData<T> {
  content: T[];
  count: number;
  pages?: number;
}

interface ResponseData<T> {
  error: boolean;
  message: string;
  data?: T;
}

interface EmailDTO {
  email: string;
  title: string;
  text: string;
}

interface Paginations {
  page?: number;
  pageSize?: number;
}
