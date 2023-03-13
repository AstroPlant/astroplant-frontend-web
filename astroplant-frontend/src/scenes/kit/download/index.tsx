import React, { useContext, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { withTranslation, WithTranslation } from "react-i18next";
import { compose } from "recompose";
import moment from "moment";
import { Button, Container, Segment, Header } from "semantic-ui-react";
import { Form } from "semantic-ui-react";

import { configuration } from "~/utils/api";
import { KitsApi } from "~/api";

import { KitContext, ConfigurationsContext } from "../contexts";

export type Props = {};
export type InnerProps = WithTranslation & RouteComponentProps<{}>;

function KitDownload(_props: InnerProps) {
  const api = new KitsApi(configuration);

  const kit = useContext(KitContext);
  const configurations = useContext(ConfigurationsContext);

  const now = moment();
  const oneMonthAgo = moment().subtract(1, "months");

  const [configurationId, setConfigurationId] = useState<number | undefined>(
    undefined
  );
  const [start, setStart] = useState(
    now.format(moment.HTML5_FMT.DATETIME_LOCAL)
  );
  const [end, setEnd] = useState(
    oneMonthAgo.format(moment.HTML5_FMT.DATETIME_LOCAL)
  );

  const configOptions = Object.entries(configurations).map(
    ([configId, configuration]) => ({
      key: configId,
      value: configId,
      text: `#${configId} - ${
        configuration.description || "Unnamed configuration"
      }`,
    })
  );

  const startM = moment(start, moment.HTML5_FMT.DATETIME_LOCAL);
  const endM = moment(end, moment.HTML5_FMT.DATETIME_LOCAL);

  const timeWindowValid = startM.isValid() && endM.isValid();

  return (
    <Container text>
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
                  <Button primary disabled>
                    Download
                  </Button>
                ) : (
                  <Button
                    primary
                    onClick={() => {
                      const query = { configurationId };
                      initiateDownload(api, kit.serial, query);
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
                primary
                onClick={() => {
                  const query = { from: startM, to: endM };
                  initiateDownload(api, kit.serial, query);
                }}
              >
                Download
              </Button>
            ) : (
              <Button primary disabled>
                Download
              </Button>
            )}
          </Form.Field>
        </Form>
      </Segment>
    </Container>
  );
}

/** Fetches an authorization token for kit data archive downloading, and, if
 * succesful, sends the client to the data download link.
 */
async function initiateDownload(
  api: KitsApi,
  kitSerial: string,
  query: {
    configurationId?: number;
    from?: moment.Moment;
    to?: moment.Moment;
  }
) {
  try {
    const token = (await api.getArchiveDownloadToken({ kitSerial }).toPromise())
      .content;

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
