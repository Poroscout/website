import { css } from "@emotion/css";
import colors from "tailwindcss/colors";
import Footer from "../../partials/Footer";
import TermsHero from "../../partials/terms/TermsHero";
import link from "../../styles/link";

const termStyles = css`
  * > h2 {
    color: ${colors.white};
  }
`;

const TermsOfServices = () => {
  return (
    <>
      <TermsHero />

      <main className="bg-slate-900 my-16">
        <div
          className={`max-w-7xl mx-6 lg:mx-auto text-gray-200 space-y-5 ${link} ${termStyles}`}
        >
          <section>
            <h2 className="mb-2 text-lg font-semibold">Usage Agreement:</h2>
            <p>
              By inviting this bot and/or using the commands of the bot, you
              agree that you have read and understood the Terms of Service and
              Privacy Policy of the bot.
              <br /> You also agree that you will use this bot in a manner that
              complies with the Discord&apos;s{" "}
              <a href="https://discord.com/terms">Terms of Service</a> and{" "}
              <a href="https://discord.com/guidelines">Community Guidelines</a>
              .
              <br /> We take no responsibility for any actions or omissions of
              the bot and are not liable for individuals who use the bot to
              break any of Discord&apos;s{" "}
              <a href="https://discord.com/terms">Terms of Service</a> or{" "}
              <a href="https://discord.com/guidelines">Community Guidelines</a>.
            </p>
            <br />
            <p>By using the bot you agree to the following:</p>
            <ul className="list-disc mx-6">
              <li>
                You will not attempt to disrupt the service of the bot through
                any means.
              </li>
              <ul className="list-disc mx-8">
                <li>This includes, but is not limited to:</li>
                <li>
                  (Distributed) Denial of Service (DoS or DDoS) attacks at
                  PoroScout&apos;s infrastructure.
                </li>
                <li>Abusing any bugs or exploits in the bot.</li>
              </ul>
              <li>
                You will not use the bot in a manner that may violate
                Discord&apos;s{" "}
                <a href="https://discord.com/terms">Terms of Service</a> or{" "}
                <a href="https://discord.com/guidelines">
                  Community Guidelines
                </a>
                .
              </li>
              <li>
                You will not use the bot in a manner that may violate any local
                laws.
              </li>
              <li>You will not use the bot to disrupt the other services.</li>
              <li>You will not use the bot to send spam or spammy content.</li>
              <li>
                You will not use the bot to send any content that is hateful,
                harassing, abusive, racist, sexist, or otherwise objectionable.
              </li>
            </ul>

            <br />
            <p>
              We reserve the right to deny any user access to the bot or any
              support methods for any reason.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold">Data Collection:</h2>
            <p>PoroScout collects the following information:</p>
            <ul className="list-disc mx-6">
              <li>
                Your <strong>Discord account ID</strong> and your{" "}
                <strong>League of Legends username, region, and ID</strong>.
                (when using the /link command)
              </li>
              <li>Anonymous website and bot usage data.</li>
              <li>
                In the event the bot malfunctions when a command gets invoked,
                the error along with context information will be sent over to{" "}
                <a href="https://sentry.io">Sentry.io</a> to be analyzed by our
                team.
                <ul className="list-disc mx-8">
                  <li className="font-semibold">
                    Data includes the following:
                  </li>
                  <li>User, Guild, and Channel ID</li>
                  <li>Command Name</li>
                  <li>Command Options if applicable</li>
                </ul>
              </li>
              <li>
                If linked, daily statistics of the linked League account&apos;s
                lp, rank, division, and tier.
              </li>
              <ul className="list-disc mx-8">
                <li>
                  LP History data is <strong>not</strong> directly linked to
                  your Discord account, instead it is linked to your League
                  account&apos;s PUUID.
                </li>
                <li>
                  This means, in the unlikely event that our LP history database
                  gets breached, there is no way to draw a line between your
                  Discord and League account.
                </li>
              </ul>
              <li>
                Your League of Legends account data (rank, past matches,
                profile, etc) is stored but is not directly linked to your
                Discord Account.
              </li>
            </ul>
            <br />
            <p>
              Furthermore, PoroScout will send the following information to our
              third-party partner Leagues.gg:
            </p>
            <ul className="list-disc mx-6">
              <li>Discord ID and Username.</li>
              <li>Command usage data (the names of commands used).</li>
            </ul>
            <p>
              This data is used to provide us with insights on how the bot is
              being used and to help us improve the bot. The data that is sent
              is under the{" "}
              <a href="https://leagues.gg/en/legal/privacy">
                Leagues.gg Privacy Policy
              </a>
              .
            </p>
            <br />
            <p>
              Throughout this page, you will see the term:{" "}
              <i>personally identifying information</i> (
              <a href="https://www.dol.gov/general/ppii">PII</a>
              ) used.
              <br /> In the case of the bot, data that is PII is data that can
              link directly to your Discord account&apos;s ID, which includes
              your linked League of Legends account name and region.
            </p>
            <br />
            <p>
              Your data is stored securly in our database. Stored data{" "}
              <i>that is personally identifying</i> is also{" "}
              <strong>encrypted</strong> for added protection.
              <br /> In the unlikely event of a data breach, we will send a
              notification in our Discord server that includes the extent of the
              data breach as soon as we are aware of the situation.
            </p>
            <br />
            <p>
              As per Discord&apos;s guidelines, any personally identifying
              information you provide will only be stored for 30 days. (inc:
              linked accounts)
              <br /> It will automatically be deleted after 30 days since your
              last command was ran (processed at midnight UTC).
            </p>
            <br />
            <p>
              PoroScout will never share any personal identifying information
              publicly without your concent unless required by law unless
              otherwise stated in this document.
              <br /> To unlink your League of Legends username, region, and ID
              from your Discord account, you can run <strong>/unlink</strong>.
              <br /> Have any questions? Feel free to email us at{" "}
              <a href="mailto:derock@derock.dev" className="font-bold">
                derock@derock.dev
              </a>
              .
            </p>
            <br />
            <p>
              Our bot/website may contain links to third-party websites that are
              not operated by us.
              <br /> We have no control over and assume no responsibility for,
              the content, privacy policies, or practices of any third party
              sites or services.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold">Affiliation:</h2>
            <p>
              PoroScout isn&apos;t endorsed by Riot Games and doesn&apos;t
              reflect the views or opinions of Riot Games or anyone officially
              involved in producing or managing Riot Games properties. Riot
              Games, and all associated properties are trademarks or registered
              trademarks of Riot Games, Inc.
            </p>
            <br />
            <p>
              PoroScout is also not affiliated with Discord. Discord is a
              registered trademark of Discord, Inc. Any direct connection to
              Discord and/or its trademark is purely coincidental. We do not
              claim to have any copyright ownership of Discord and/or its
              assets.
            </p>
          </section>
        </div>
      </main>

      <Footer withBorder />
    </>
  );
};

export default TermsOfServices;
