import { useContext, useState } from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import compose from "~/utils/compose";
import { DateTime } from "luxon";
import { Segment, Header } from "semantic-ui-react";
import { Form } from "semantic-ui-react";

import { api } from "~/api";

import { KitContext, ConfigurationsContext } from "../contexts";
import { firstValueFrom } from "rxjs";
import { Button } from "~/Components/Button";

import commonStyle from "~/Common.module.css";

export type Props = {};
export type InnerProps = WithTranslation;

function KitDownload(_props: InnerProps) {
  const kit = useContext(KitContext);
  const configurations = useContext(ConfigurationsContext);

  const oneMonthAgo = DateTime.now().minus({ months: 1 });
  const now = DateTime.now();

  const [configurationId, setConfigurationId] = useState<number | undefined>(
    undefined,
  );

  // Formatting from: https://github.com/moment/luxon/discussions/1136
  const [start, setStart] = useState(
    oneMonthAgo.startOf("minute").toISO({
      includeOffset: false,
      suppressSeconds: true,
      suppressMilliseconds: true,
    })!,
  );
  const [end, setEnd] = useState(
    now.startOf("minute").toISO({
      includeOffset: false,
      suppressSeconds: true,
      suppressMilliseconds: true,
    })!,
  );

  const configOptions = Object.entries(configurations).map(
    ([configId, configuration]) => ({
      key: configId,
      value: configId,
      text: `#${configId} - ${
        configuration.description || "Unnamed configuration"
      }`,
    }),
  );

  const startM = DateTime.fromISO(start);
  const endM = DateTime.fromISO(end);

  const timeWindowValid = startM.isValid && endM.isValid;

  return (
    <article className={commonStyle.containerRegular}>
      <div>
        <p>
          To download a data archive, please choose a time window or a
          configuration to download data for.
        </p>
      </div>
      <Segment padded>
        <Header>Download data produced by a configuration</Header>
        {Object.keys(configurations).length > 0 ? (
          <>
            <p>
              Select a configuration to download an archive of all data
              generated in that configuration.
            </p>
            <Form>
              <Form.Group>
                <Form.Field>
                  <label>Configuration</label>
                  <Form.Select
                    options={configOptions}
                    value={String(configurationId)}
                    onChange={(_, p) => setConfigurationId(Number(p.value))}
                  />
                </Form.Field>
              </Form.Group>
              <Form.Field>
                {configurationId === undefined ? (
                  <Button variant="primary" disabled>
                    Download
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={() => {
                      const query = { configurationId };
                      initiateDownload(kit.serial, query);
                    }}
                  >
                    Download
                  </Button>
                )}
              </Form.Field>
            </Form>
          </>
        ) : (
          <>
            <p>This kit has no configurations yet.</p>
            <p>
              For help on how to configure your kit you can read the
              documentation{" "}
              <a
                target="_blank"
                rel="noreferrer"
                href="https://docs.astroplant.io/astroplant-kit-setup/registering-and-configuring-a-kit"
              >
                here
              </a>
            </p>
          </>
        )}
      </Segment>
      <Segment padded>
        <Header>Download data produced during a given time window</Header>
        <p>
          Choose a start and end date and time to download an archive of all
          data generated in that time window.
        </p>
        <Form>
          <Form.Group>
            <Form.Field>
              <label>Start date and time</label>
              <Form.Input
                type="datetime-local"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </Form.Field>
            <Form.Field>
              <label>End date and time</label>
              <Form.Input
                type="datetime-local"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </Form.Field>
          </Form.Group>
          <Form.Field>
            {timeWindowValid ? (
              <Button
                variant="primary"
                onClick={() => {
                  const query = { from: startM, to: endM };
                  initiateDownload(kit.serial, query);
                }}
              >
                Download
              </Button>
            ) : (
              <Button variant="primary" disabled>
                Download
              </Button>
            )}
          </Form.Field>
        </Form>
      </Segment>
    </article>
  );
}

/** Fetches an authorization token for kit data archive downloading, and, if
 * succesful, sends the client to the data download link.
 */
async function initiateDownload(
  kitSerial: string,
  query: {
    configurationId?: number;
    from?: DateTime;
    to?: DateTime;
  },
) {
  try {
    const token = (
      await firstValueFrom(api.getArchiveDownloadToken({ kitSerial }))
    ).data;

    if (!token) {
      throw new Error("failed to fetch token");
    }

    const url = api.constructArchiveDownloadLink({
      token,
      kitSerial,
      ...query,
    });
    if (url) {
      // Browsers usually see that this location has an attachment header, so
      // they will not actually navigate the user away from the page.
      window.location.href = url;
    }
  } catch {}
}

export default compose<InnerProps, Props>(withTranslation())(KitDownload);
