import React, { useState, useEffect } from "react";
import { Container, Image, Table, Button, Modal } from "semantic-ui-react";
import { DateTime } from "luxon";

import RelativeTime from "~/Components/RelativeTime";
import Loading from "~/Components/Loading";
import { KitState, KitConfigurationState } from "~/modules/kit/reducer";
import { api, schemas } from "~/api";
import { rateLimit } from "~/utils/api";
import { rtkApi } from "~/services/astroplant";
import { skipToken } from "@reduxjs/toolkit/dist/query";

export type Props = {
  kitState: KitState;
};

export default function Media(props: Props) {
  const { kitState } = props;

  let activeConfiguration: KitConfigurationState | undefined;
  for (const configuration of Object.values(kitState.configurations!)) {
    if (configuration.active) {
      activeConfiguration = configuration;
      break;
    }
  }

  const {
    data: mediaList,
    error: mediaListError,
    isLoading: mediaListIsLoading,
  } = rtkApi.useListMediaQuery(
    activeConfiguration
      ? {
          kitSerial: kitState.details!.serial,
          configuration: activeConfiguration.id,
        }
      : skipToken
  );

  const [displayMedia, setDisplayMedia] = useState<schemas["Media"] | null>(
    null
  );
  const [displayUrl, setDisplayUrl] = useState<string | null>(null);

  useEffect(() => {
    if (displayMedia) {
      (async () => {
        try {
          const response = await api
            .getMediaContent({ mediaId: displayMedia.id })
            .pipe(rateLimit)
            .toPromise();

          const url = URL.createObjectURL(response.data);
          setDisplayUrl(url);
        } catch (error) {
          alert(error);
          setDisplayMedia(null);
        }
      })();
    }
  }, [displayMedia]);

  useEffect(() => {
    // Clean up old media display URLs.
    return () => {
      if (displayUrl !== null) {
        setDisplayMedia(null);
        URL.revokeObjectURL(displayUrl);
      }
    };
  }, [displayUrl]);

  if (mediaListIsLoading) {
    return <Loading />;
  }

  if (mediaListError) {
    return <Container>Failed to fetch media content.</Container>;
  }

  if (mediaList !== undefined && mediaList.length > 0) {
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
                      <RelativeTime
                        to={DateTime.fromISO(displayMedia.datetime)}
                      />
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
            {mediaList.map((media) => {
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
