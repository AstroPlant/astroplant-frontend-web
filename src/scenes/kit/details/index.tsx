import React from "react";
import { RouteComponentProps, Route, Switch } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withTranslation, WithTranslation } from "react-i18next";
import { compose } from "recompose";
import {
  Button,
  Container,
  Segment,
  Transition,
  Icon,
  Header,
  Divider
} from "semantic-ui-react";
import ReactMarkdown from "react-markdown";
import { removeNull, undefinedToNull, emptyStringToNull } from "utils/form";
import { pushUpOne } from "utils/router";

import { addKit } from "modules/kit/actions";
import { KitMembership } from "modules/me/reducer";
import { Kit, KitsApi } from "astroplant-api";
import { AuthConfiguration } from "utils/api";
import Option from "utils/option";

import {
  schema as patchSchema,
  uiSchema as patchUiSchema
} from "./patch-kit-schema";
import ApiForm from "Components/ApiForm";
import MapWithMarker from "Components/MapWithMarker";

const PatchKitForm = ApiForm<any, Kit>();

export type Props = {
  kit: Kit;
  membership: Option<KitMembership>;
};

export type InnerProps = WithTranslation &
  RouteComponentProps<{}> &
  Props & {
    addKit: (payload: Kit) => void;
  };

type State = {
  done: boolean;
};

class KitConfigure extends React.Component<InnerProps, State> {
  state: State = {
    done: false
  };

  patchSend(formData: any) {
    const { kit } = this.props;

    console.warn(formData);

    const api = new KitsApi(AuthConfiguration.Instance);
    return api.patchKit({
      kitSerial: kit.serial,
      patchKit: emptyStringToNull(
        undefinedToNull(formData, [
          "name",
          "description",
          "privacyPublicDashboard",
          "privacyShowOnMap"
        ])
      )
    });
  }

  onPatchResponse(response: Kit) {
    const { addKit } = this.props;
    addKit(response);
    this.setState({ done: true });
    pushUpOne(this.props.history);
  }

  render() {
    const { t, kit, membership } = this.props;
    const { url, path } = this.props.match;

    const canEditDetails = membership.map(m => m.accessSuper).unwrapOr(false);

    return (
      <Container text>
        <Segment piled padded>
          <Switch>
            <Route
              path={`${path}/edit`}
              render={props => {
                return (
                  <PatchKitForm
                    schema={patchSchema(t) as any}
                    uiSchema={patchUiSchema as any}
                    send={formData => this.patchSend(formData)}
                    onResponse={formData => this.onPatchResponse(formData)}
                    formData={removeNull(kit)}
                  />
                );
              }}
            />
            <Route
              render={props => (
                <>
                  {this.state.done && (
                    <>
                      <Header size="huge" icon textAlign="center">
                        <Transition
                          animation="drop"
                          duration={450}
                          transitionOnMount
                        >
                          <Icon name="check" circular />
                        </Transition>
                        <Header.Content>Success!</Header.Content>
                      </Header>
                      <p>Your kit's details have been changed.</p>
                      <Divider />
                    </>
                  )}
                  <div>
                    {canEditDetails && (
                      <Button
                        onClick={() => this.props.history.push(`${url}/edit`)}
                        primary
                      >
                        Edit kit details
                      </Button>
                    )}
                    <h3>{kit.name || kit.serial}</h3>
                    <ReactMarkdown source={kit.description} />
                    {typeof kit.latitude === "number" &&
                      typeof kit.longitude === "number" && (
                        <>
                          <Divider />
                          <MapWithMarker
                            location={{
                              latitude: kit.latitude,
                              longitude: kit.longitude
                            }}
                          />
                        </>
                      )}
                  </div>
                </>
              )}
            />
          </Switch>
        </Segment>
      </Container>
    );
  }
}

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      addKit
    },
    dispatch
  );

export default compose<InnerProps, Props>(
  withTranslation(),
  connect(
    null,
    mapDispatchToProps
  )
)(KitConfigure);
