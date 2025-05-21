module.exports = {
  /**
   * @param {import('pocketbase').Dao} dao
   */
  up: (dao) => {
    const commands = [
      // guilds
      "CREATE UNIQUE INDEX idx_guilds_discordID ON guilds (discordID);",
      // messages
      "CREATE INDEX idx_messages_guildID ON messages (guildID);",
      "CREATE INDEX idx_messages_author ON messages (author);",
      "CREATE INDEX idx_messages_channelID ON messages (channelID);",
      "CREATE INDEX idx_messages_created ON messages (created);",
      "CREATE INDEX idx_messages_guildID_created ON messages (guildID, created);",
      // member_leaves
      "CREATE INDEX idx_member_leaves_guildID ON member_leaves (guildID);",
      "CREATE INDEX idx_member_leaves_memberID ON member_leaves (memberID);",
      "CREATE INDEX idx_member_leaves_created ON member_leaves (created);",
      "CREATE INDEX idx_member_leaves_guildID_memberID ON member_leaves (guildID, memberID);",
      // member_joins
      "CREATE INDEX idx_member_joins_guildID ON member_joins (guildID);",
      "CREATE INDEX idx_member_joins_memberID ON member_joins (memberID);",
      "CREATE INDEX idx_member_joins_created ON member_joins (created);",
      "CREATE INDEX idx_member_joins_guildID_memberID ON member_joins (guildID, memberID);",
      // invites
      "CREATE INDEX idx_invites_guildID ON invites (guildID);",
      "CREATE INDEX idx_invites_authorID ON invites (authorID);",
      "CREATE INDEX idx_invites_channelID ON invites (channelID);",
      "CREATE INDEX idx_invites_created ON invites (created);"
    ];

    for (const command of commands) {
      dao.db().newQuery(command).execute();
    }
  },

  /**
   * @param {import('pocketbase').Dao} dao
   */
  down: (dao) => {
    // Optional: Add commands to drop indexes in reverse order of creation
    const commands = [
      // invites
      "DROP INDEX idx_invites_created;",
      "DROP INDEX idx_invites_channelID;",
      "DROP INDEX idx_invites_authorID;",
      "DROP INDEX idx_invites_guildID;",
      // member_joins
      "DROP INDEX idx_member_joins_guildID_memberID;",
      "DROP INDEX idx_member_joins_created;",
      "DROP INDEX idx_member_joins_memberID;",
      "DROP INDEX idx_member_joins_guildID;",
      // member_leaves
      "DROP INDEX idx_member_leaves_guildID_memberID;",
      "DROP INDEX idx_member_leaves_created;",
      "DROP INDEX idx_member_leaves_memberID;",
      "DROP INDEX idx_member_leaves_guildID;",
      // messages
      "DROP INDEX idx_messages_guildID_created;",
      "DROP INDEX idx_messages_created;",
      "DROP INDEX idx_messages_channelID;",
      "DROP INDEX idx_messages_author;",
      "DROP INDEX idx_messages_guildID;",
      // guilds
      "DROP INDEX idx_guilds_discordID;"
    ];

    for (const command of commands) {
      dao.db().newQuery(command).execute();
    }
  }
};
