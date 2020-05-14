enum IPCEvents {
  SELECT_DIR = "select_dir",
  CREATE_ROOM = "create_room",
  JOIN_ROOM = "join_room",
  NAVIGATE = "navigate",
  DISCONNECTED = "disconnected",
  CHECK_CONNECTION = "check_connection",
  FETCH_LOG = "fetch_log",
  FETCH_FOLDER = "fetch_folder",
  FETCH_USERS = "fetch_users",
  CREATE_WINDOW = "create_window",
  UPDATE_FOLDER = "update_folder",
  UPDATE_USERS = "update_users",
  SELECT_AVATAR = "select_avatar",
  SAVE_USER_SETTINGS = "save_user_settings",
  SAVE_ROOM_SETTINGS = "save_room_settings",
  SAVE_INTERFACE_SETTINGS = "save_interface_settings",
  FETCH_SETTINGS = "fetch_settings",
  NOTIFICATION = "notification",
}

export default IPCEvents;
