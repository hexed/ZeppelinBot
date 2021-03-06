import { botControlCmd } from "../types";
import { isOwnerPreFilter, sendErrorMessage, sendSuccessMessage } from "../../../pluginUtils";
import { commandTypeHelpers as ct } from "../../../commandTypes";
import { isSnowflake } from "../../../utils";

export const AllowServerCmd = botControlCmd({
  trigger: ["allow_server", "allowserver", "add_server", "addserver"],
  permission: null,
  config: {
    preFilters: [isOwnerPreFilter],
  },

  signature: {
    guildId: ct.string(),
  },

  async run({ pluginData, message: msg, args }) {
    const existing = await pluginData.state.allowedGuilds.find(args.guildId);
    if (existing) {
      sendErrorMessage(pluginData, msg.channel, "Server is already allowed!");
      return;
    }

    if (!isSnowflake(args.guildId)) {
      sendErrorMessage(pluginData, msg.channel, "Invalid server ID!");
      return;
    }

    await pluginData.state.allowedGuilds.add(args.guildId);
    await pluginData.state.configs.saveNewRevision(`guild-${args.guildId}`, "plugins: {}", msg.author.id);
    sendSuccessMessage(pluginData, msg.channel, "Server is now allowed to use Zeppelin!");
  },
});
