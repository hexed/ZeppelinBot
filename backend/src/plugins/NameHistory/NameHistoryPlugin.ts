import { PluginOptions } from "knub";
import { ConfigSchema, NameHistoryPluginType } from "./types";
import { zeppelinGuildPlugin } from "../ZeppelinPluginBlueprint";
import { GuildNicknameHistory } from "../../data/GuildNicknameHistory";
import { UsernameHistory } from "../../data/UsernameHistory";
import { Queue } from "../../Queue";
import { NamesCmd } from "./commands/NamesCmd";
import { ChannelJoinEvt, MessageCreateEvt } from "./events/UpdateNameEvts";

const defaultOptions: PluginOptions<NameHistoryPluginType> = {
  config: {
    can_view: false,
  },
  overrides: [
    {
      level: ">=50",
      config: {
        can_view: true,
      },
    },
  ],
};

export const NameHistoryPlugin = zeppelinGuildPlugin<NameHistoryPluginType>()("name_history", {
  showInDocs: false,

  configSchema: ConfigSchema,
  defaultOptions,

  // prettier-ignore
  commands: [
    NamesCmd,
  ],

  // prettier-ignore
  events: [
    ChannelJoinEvt,
    MessageCreateEvt,
  ],

  onLoad(pluginData) {
    const { state, guild } = pluginData;

    state.nicknameHistory = GuildNicknameHistory.getGuildInstance(guild.id);
    state.usernameHistory = new UsernameHistory();
    state.updateQueue = new Queue();
  },
});
