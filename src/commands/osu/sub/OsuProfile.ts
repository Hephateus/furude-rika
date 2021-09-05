import { CommandInteraction } from 'discord.js';
import BotEmbed from '../../../Classes/Embed/BotEmbed';
import OsuServerOption from '../../../Classes/SlashCommands/SlashOptions/OsuOptions/OsuServerOption';
import OsuUserOption from '../../../Classes/SlashCommands/SlashOptions/OsuOptions/OsuUserOption';
import DBManager from '../../../DB/DBManager';
import Localizer from '../../../Localization/Localizer';
import LocalizeTags from '../../../Localization/LocalizeTags';
import Droid from '../../../Osu!/Servers/Droid';
import SubCommandABC from '../../SubCommandABC';

class OsuProfile extends SubCommandABC {
  public constructor() {
    super();
    this.setName('profile').setDescription(
      "Views yours or someone's osu! profile"
    );
    this.addStringOption(new OsuUserOption());
    this.addStringOption(new OsuServerOption());
  }
  async run(interaction: CommandInteraction) {
    await interaction.deferReply();

    const userData = await DBManager.getUserData(interaction);

    const server = OsuServerOption.getTag(interaction, userData);
    const user = await OsuUserOption.getTag(interaction, server, userData);

    if (user == null) {
      return;
    }

    let performanceInfo = '>>> **';
    if (!(server instanceof Droid)) {
      performanceInfo = performanceInfo.concat(`PP: ${user.pp.raw}\n`);
    }
    performanceInfo = performanceInfo.concat(`Rank: #${user.pp.rank} `);
    if (!(server instanceof Droid)) {
      performanceInfo = performanceInfo.concat(` (#${user.pp.countryRank})`);
    }
    performanceInfo = performanceInfo.concat(
      `\nAccuracy: ${user.accuracyFormatted}
       PlayCount: ${user.counts.plays}
       Total Score: ${user.scores.total.toLocaleString(
         interaction.guild.preferredLocale
       )}
       Ranked Score: ${user.scores.ranked.toLocaleString(
         interaction.guild.preferredLocale
       )}`
    );
    if (!(server instanceof Droid)) {
      performanceInfo = performanceInfo.concat(
        `
        Level: ${user.level.toFixed(2)}
        `
      );
    }
    performanceInfo = performanceInfo.concat('**');

    const embed = new BotEmbed(interaction)
      .setDescription(
        `**[${Localizer.getLocaleString(
          interaction,
          LocalizeTags.osuProfileTitle
        ).replace('USER', user.name)}](${user.profileUrl})**`
      )
      .addField('---Perfomance', performanceInfo, true)
      .setThumbnail(user.avatarUrl);

    if (!(server instanceof Droid)) {
      embed.addField(
        'Counts',
        `>>> **SSH: ${user.counts.SSH}
        SS: ${user.counts.SS}
        A: ${user.counts.A}
        **`,
        true
      );
    }

    await interaction.editReply({
      embeds: [embed]
    });
  }
}

export default OsuProfile;
