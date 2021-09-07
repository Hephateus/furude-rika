import { SlashCommandNumberOption } from '@discordjs/builders';
import CommandABC from '@furude-commands/CommandABC';
import Localizer from '@furude-localization/Localizer';
import LocalizeTags from '@furude-localization/LocalizeTags';
import { CommandInteraction } from 'discord.js';
import RandomHelper from '@furude-math/RandomHelper';

class Roll extends CommandABC {
  public boundTag = 'bound';

  constructor() {
    super();
    this.setName('roll').setDescription(
      'Randomly picks a number within a certain bound'
    );
    this.addNumberOption(
      new SlashCommandNumberOption()
        .setName(this.boundTag)
        .setDescription('The bound number for the roll')
        .setRequired(true)
    );
  }
  async run(interaction: CommandInteraction) {
    const bound = interaction.options.getNumber(this.boundTag, true);
    const random = RandomHelper.getRandomInt(0, bound);
    await interaction.reply(
      `** ${Localizer.getLocaleString(
        interaction,
        LocalizeTags.rollReply
      ).replace('RANDOM', random.toString())} ** `
    );
  }
}

export default {
  data: new Roll()
};
