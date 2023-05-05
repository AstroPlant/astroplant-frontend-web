import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Container, Image, Table, Button, Modal } from "semantic-ui-react";
import { DateTime } from "luxon";

import RelativeTime from "~/Components/RelativeTime";
import { KitState, KitConfigurationState } from "~/modules/kit/reducer";
import { selectors as peripheralDefinitionsSelectors } from "~/modules/peripheral-definition/reducer";
import { KitsApi, schemas } from "~/api";
import { configuration, rateLimit } from "~/utils/api";
import { tap } from "rxjs/operators";

export type Props = {
  kitState: KitState;
};

export default function Media(props: Props) {
  const peripheralDefinitions = useSelector(
    peripheralDefinitionsSelectors.selectEntities
  );

  const [media, setMedia] = useState<Array<schemas["Media"]>>([]);
  const [displayMedia, setDisplayMedia] = useState<schemas["Media"] | null>(
    null
  );
  const [displayUrl, setDisplayUrl] = useState<string | null>(null);
  const [activeConfiguration, setActiveConfiguration] =
    useState<KitConfigurationState | null>(null);
  const [downloadLoading, setDownloadLoading] = useState<boolean>(false);

  const { kitState } = props;

  useEffect(() => {
    for (const configuration of Object.values(kitState.configurations!)) {
      if (configuration.active) {
        setActiveConfiguration(configuration);
        break;
      }
    }
  }, [kitState.configurations]);

  useEffect(() => {
    if (activeConfiguration) {
      (async () => {
        const kitSerial = kitState.details!.serial;
        const kitsApi = new KitsApi(configuration);
        const response = await kitsApi
          .listMedia({ kitSerial, configuration: activeConfiguration.id })
          .pipe(rateLimit)
          .toPromise();
        setMedia(response.content);
      })();
    }

    return () => setMedia([]);
  }, [kitState.details, activeConfiguration]);

  useEffect(() => {
    if (displayMedia) {
      (async () => {
        try {
          const kitsApi = new KitsApi(configuration);
          const response = await kitsApi
            .getMediaContent({ mediaId: displayMedia.id + "AIAA" })
            .pipe(rateLimit)
            .toPromise();

          const url = URL.createObjectURL(response.content);
          setDisplayUrl(url);
        } catch (error) {
          alert(error);
          setDisplayMedia(null);
        }
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

  const downloadMedia = (media: schemas["Media"]) => {
    setDownloadLoading(true);
    const kitsApi = new KitsApi(configuration);
    kitsApi.downloadMediaContent({ mediaId: media.id });
    setDownloadLoading(false);
  };

  if (media.length > 0) {
    return (
      <>
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
                      <RelativeTime to={DateTime.fromISO(displayMedia.datetime)} />
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
              const peripheral =
                activeConfiguration!.peripherals[media.peripheralId]!;
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
                      <RelativeTime to={DateTime.fromISO(media.datetime)} />
                  </Table.Cell>
                  <Table.Cell>{peripheral.name}</Table.Cell>
                  <Table.Cell>{media.name}</Table.Cell>
                  <Table.Cell>{media.type}</Table.Cell>
                  <Table.Cell>{media.size}</Table.Cell>
                  <Table.Cell>
                    {/*
                    <Button
                      color="olive"
                      onClick={() => downloadMedia(media)}
                      disabled={downloadLoading}
                      loading={downloadLoading}
                    >
                      Download
                    </Button>*/}
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
