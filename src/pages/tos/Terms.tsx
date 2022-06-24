import Header from "./Header";
import "../../assets/css/tos.css";
import Footer from "./Footer";
import ExternalLink from "../../components/ExternalLink";

const lastUpdated = new Date("2022-06-24T01:02:31.335Z");

function TermsOfService() {
  return (
    <div className="mx-6 space-y-5 mb-2">
      <Header />

      <div className="space-y-1">
        <h1 className="text-2xl text-center">
          Terms of Use and Privacy Policy
        </h1>
        <p className="text-center italic">
          Updated:{" "}
          {lastUpdated.toLocaleString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Usage Agreement:</h2>
        <p>
          By inviting this bot and/or using the commands of the bot, you agree
          that you have read and understood the Terms of Service and Privacy
          Policy of the bot.
          <br /> You also agree that you will use this bot in a manner that
          complies with the Discord's{" "}
          <ExternalLink href="https://discord.com/terms">
            Terms of Service
          </ExternalLink>{" "}
          and{" "}
          <ExternalLink href="https://discord.com/guidelines">
            Community Guidelines
          </ExternalLink>
          .
          <br /> We take no responsibility for any actions or omissions of the
          bot and are not liable for individuals who use the bot to break any of
          Discord's{" "}
          <ExternalLink href="https://discord.com/terms">
            Terms of Service
          </ExternalLink>{" "}
          or{" "}
          <ExternalLink href="https://discord.com/guidelines">
            Community Guidelines
          </ExternalLink>
          .
        </p>
        <br />
        <p>By using the bot you agree to the following:</p>
        <ul className="list-disc mx-6">
          <li>
            You will not attempt to disrupt the service of the bot through any
            means.
          </li>
          <ul className="list-disc mx-8">
            <li>This includes, but is not limited to:</li>
            <li>
              (Distributed) Denial of Service (DoS or DDoS) attacks at
              PoroScout's infrastructure.
            </li>
            <li>Abusing any bugs or exploits in the bot.</li>
          </ul>
          <li>
            You will not use the bot in a manner that may violate Discord's{" "}
            <ExternalLink href="https://discord.com/terms">
              Terms of Service
            </ExternalLink>{" "}
            or{" "}
            <ExternalLink href="https://discord.com/guidelines">
              Community Guidelines
            </ExternalLink>
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
        <p>We reserve the right to deny any user access to the bot or any support methods for any reason.</p>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Data Collection:</h2>
        <p>PoroScout collects the following information:</p>
        <ul className="list-disc mx-6">
          <li>
            Your <strong>Discord account ID</strong> and your{" "}
            <strong>League of Legends username, region, and ID</strong>. (when
            using the /link command)
          </li>
          <li>Anonymous website and bot usage data.</li>
          <li>
            In the event the bot malfunctions when a command gets invoked, the error along with context information will be sent over to{" "}
            <ExternalLink href="https://sentry.io">Sentry.io</ExternalLink> to be analyzed by our team.
            <ul className="list-disc mx-8">
              <li className="font-semibold">Data includes the following:</li>
              <li>User, Guild, and Channel ID</li>
              <li>Command Name</li>
              <li>Command Options if applicable</li>
            </ul>
          </li>
          <li>If linked, daily statistics of the linked League account's lp, rank, division, and tier.</li>
          <ul className="list-disc mx-8">
            <li>LP History data is <strong>not</strong> directly linked to your Discord account, instead it is linked to your League account's PUUID.</li>
            <li>This means, in the unlikely event that our LP history database gets breached, there is no way to draw a line between your Discord and League account.</li>
          </ul>
          <li>
            Your League of Legends account data (rank, past matches, profile,
            etc) is stored but is not directly linked to your Discord Account.
          </li>
        </ul>
        <br />
        <p>
          Throughout this page, you will see the term: <i>personally identifying information</i> (
            <ExternalLink href="https://www.dol.gov/general/ppii">PII</ExternalLink>
            ) used.
          <br /> In the case of the bot, data that is PII is data that can link directly to your Discord account's ID, which includes your linked League of Legends account name and region.
        </p>
        <br />
        <p>
          Your data is stored securly in our database. Stored data <i>that is personally identifying</i> is also{" "}
          <strong>encrypted</strong> for added protection.
          <br /> In the unlikely event of a data breach, we will send a
          notification in our Discord server that includes the extent of the
          data breach as soon as we are aware of the situation.
        </p>
        <br />
        <p>
          As per Discord's guidelines, any personally identifying information you
          provide will only be stored for 30 days. (inc: linked accounts)
          <br /> It will automatically be deleted after 30 days (processed at
          midnight UTC).
        </p>
        <br />
        <p>
          PoroScout will never share any personal identifying information
          publicly without your concent unless required by law.
          <br /> To unlink your League of Legends username, region, and ID from
          your Discord account, you can run <strong>/unlink</strong>.
          <br /> Have any questions? Feel free to email us at{" "}
          <ExternalLink href="mailto:derock@derock.dev" className="font-bold">
            derock@derock.dev
          </ExternalLink>
          .
        </p>
        <br />
        <p>
          Our bot/website may contain links to third-party websites that are not
          operated by us.
          <br /> We have no control over and assume no responsibility for, the
          content, privacy policies, or practices of any third party sites or
          services.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Affiliation:</h2>
        <p>
          PoroScout isn't endorsed by Riot Games and doesn't reflect the views
          or opinions of Riot Games or anyone officially involved in producing
          or managing Riot Games properties. Riot Games, and all associated
          properties are trademarks or registered trademarks of Riot Games, Inc.
        </p>
        <br />
        <p>
          PoroScout is also not affiliated with Discord. Discord is a registered
          trademark of Discord, Inc. Any direct connection to Discord and/or its
          trademark is purely coincidental. We do not claim to have any
          copyright ownership of Discord and/or its assets.
        </p>
      </section>

      <Footer />
    </div>
  );
}

export default TermsOfService;
