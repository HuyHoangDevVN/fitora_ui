export enum GroupPrivacy {
  Public = 1,
  Private = 2,
  Secret = 3,
}

export enum GroupStatus {
  Active = 1,
  Deleted = 2,
  Banned = 3,
  Archived = 4,
}

export enum GroupRole {
  Owner = 1, // Chủ sở hữu nhóm
  Admin = 2, // Quản trị viên của nhóm
  Moderator = 3, // Người kiểm duyệt nội dung
  Member = 4, // Thành viên thông thường
}
