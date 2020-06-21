import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Container, Image, Table, Button, Modal } from "semantic-ui-react";
import Moment from "react-moment";
import { RootState } from "types";
import { KitState, KitConfigurationState } from "modules/kit/reducer";
import { PeripheralDefinition } from "astroplant-api";
import { KitsApi, schemas } from "api";
import { configuration, rateLimit } from "utils/api";
import Option from "utils/option";

import RawMeasurementComp from "./RawMeasurement";

type Params = { kitSerial: string };

export type Props = {
  kitState: KitState;
  peripheralDefinitions: { [id: string]: PeripheralDefinition };
};

function Media(props: Props) {
  const [media, setMedia] = useState<Array<schemas["Media"]>>([]);
  const [displayMedia, setDisplayMedia] = useState<schemas["Media"] | null>(
    null
  );
  const [displayUrl, setDisplayUrl] = useState<string | null>(null);
  const [
    activeConfiguration,
    setActiveConfiguration,
  ] = useState<KitConfigurationState | null>(null);
  const [openImage, setOpenImage] = useState(null);

  const { kitState } = props;

  useEffect(() => {
    for (const configuration of Object.values(
      kitState.configurations.unwrap()
    )) {
      if (configuration.active) {
        setActiveConfiguration(configuration);
        break;
      }
    }
  }, []);

  useEffect(() => {
    if (activeConfiguration) {
      (async () => {
        const kitSerial = kitState.details.unwrap().serial;
        const kitsApi = new KitsApi(configuration);
        const response = await kitsApi
          .listMedia({ kitSerial, configuration: activeConfiguration.id })
          .pipe(rateLimit)
          .toPromise();
        setMedia(response.content);
      })();
    }

    return () => setMedia([]);
  }, [activeConfiguration]);

  useEffect(() => {
    if (displayMedia) {
      (async () => {
        const kitsApi = new KitsApi(configuration);
        const response = await kitsApi
          .getMediaContent({ mediaId: displayMedia.id })
          .pipe(rateLimit)
          .toPromise();

        const url = URL.createObjectURL(response.content);
        setDisplayUrl(url);
      })();
    }
  }, [displayMedia]);

  useEffect(() => {
    return () => {
      if (displayUrl !== null) {
        setDisplayMedia(null);
        URL.revokeObjectURL(displayUrl);
      }
    };
  }, [displayUrl]);

  if (media.length > 0) {
    return (
      <>
        {displayMedia !== null && displayUrl === null && <div>Loading</div>}
        {displayMedia !== null && displayUrl !== null && (
          <Modal open={true} onClose={() => setDisplayUrl(null)}>
            <Modal.Header>{displayMedia.name}</Modal.Header>
            <Modal.Content>
              <Image src={displayUrl} centered />
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Date</Table.HeaderCell>
                    <Table.HeaderCell>Peripheral</Table.HeaderCell>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Type</Table.HeaderCell>
                    <Table.HeaderCell>Size (bytes)</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>
                      <Moment interval={15000}>{displayMedia.datetime}</Moment>
                    </Table.Cell>
                    <Table.Cell>
                      {
                        activeConfiguration!.peripherals[
                          displayMedia.peripheralId
                        ]!.name
                      }
                    </Table.Cell>
                    <Table.Cell>{displayMedia.name}</Table.Cell>
                    <Table.Cell>{displayMedia.type}</Table.Cell>
                    <Table.Cell>{displayMedia.size}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Modal.Content>
          </Modal>
        )}
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Date</Table.HeaderCell>
              <Table.HeaderCell>Peripheral</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Size (bytes)</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {media.map((media) => {
              const peripheral = activeConfiguration!.peripherals[
                media.peripheralId
              ]!;
              const displayable =
                media.type === "image/png" ||
                media.type === "image/jpeg" ||
                media.type === "image/gif";
              const disabled = displayMedia !== null;
              const loading =
                displayMedia !== null &&
                displayMedia.id === media.id &&
                displayUrl === null;
              return (
                <Table.Row key={media.id}>
                  <Table.Cell>
                    <Moment fromNow interval={15000}>
                      {media.datetime}
                    </Moment>
                  </Table.Cell>
                  <Table.Cell>{peripheral.name}</Table.Cell>
                  <Table.Cell>{media.name}</Table.Cell>
                  <Table.Cell>{media.type}</Table.Cell>
                  <Table.Cell>{media.size}</Table.Cell>
                  <Table.Cell>
                    {displayable && (
                      <Button
                        primary
                        onClick={() => setDisplayMedia(media)}
                        disabled={disabled}
                        loading={loading}
                      >
                        Display
                      </Button>
                    )}
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </>
    );
  } else {
    return <Container>No media has been produced.</Container>;
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    peripheralDefinitions: state.peripheralDefinition.definitions,
  };
};

export default connect(mapStateToProps)(Media);
