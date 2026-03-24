// src/common/mock/db.mock.ts

export const MockUsers = [
  {
    id: 1,
    username: 'admin',
    password: '$2b$10$c5PZK9AjJnSp9YazVlTNG.FYDLxEwm.bKbeqatXjllAJS7UkvnnCW',
    key: '1',
    userCode: 'U1',
    lastName: '田中', // Tanaka
    lastNameKana: 'タナカ',
    name: '太郎', // Tarou
    nameKana: 'タロウ',
    departmentCode: 'ACFD001',
    departmentName: '開発部', // Phòng Phát triển
    roleCode: 'ADMIN',
    roleName: 'ADMIN',
    email: 'admin@demo.com',
    staffCode: 'EMP-001',
    remarks: 'Tài khoản quản trị',
    lastLogin: 'Vừa xong',
  },
  {
    id: 2,
    username: 'user1',
    password: '$2b$10$c5PZK9AjJnSp9YazVlTNG.FYDLxEwm.bKbeqatXjllAJS7UkvnnCW',
    key: '2',
    userCode: 'U2',
    lastName: '佐藤', // Sato
    lastNameKana: 'サトウ',
    name: '花子', // Hanako
    nameKana: 'ハナコ',
    departmentCode: 'ACFD002',
    departmentName: '営業部', // Phòng Kinh doanh
    roleCode: 'USER',
    roleName: 'USER',
    email: 'user@demo.com',
    staffCode: 'EMP-002',
    remarks: 'Nhân viên test',
    lastLogin: 'Vừa xong',
  },
];
