import React from "react";
import compose from "~/utils/compose";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withTranslation, WithTranslation } from "react-i18next";
import {
  Container,
  Modal,
  Card,
  Header,
  Button,
  Icon,
  Transition,
} from "semantic-ui-react";

import { RootState } from "~/types";
import { KitConfigurationState } from "~/modules/kit/reducer";
import { peripheralCreated } from "~/modules/kit/actions";
import { selectors as peripheralDefinitionsSelectors } from "~/modules/peripheral-definition/reducer";

import { JSONSchema7 } from "json-schema";
import ApiForm from "~/Components/ApiForm";

import PeripheralDefinitionCard from "~/Components/PeripheralDefinitionCard";
import { api, Response, schemas } from "~/api";

type State = {
  open: boolean;
  done: boolean;
  peripheralDefinition: schemas["PeripheralDefinition"] | null;
};

export type Props = {
  kit: schemas["Kit"];
  configuration: KitConfigurationState;
};

type PInner = Props &
  WithTranslation & {
    peripheralDefinitions: { [id: string]: schemas["PeripheralDefinition"] | undefined };
    peripheralCreated: (payload: {
      serial: string;
      configurationId: number;
      peripheral: schemas["Peripheral"];
    }) => void;
  };

const PeripheralForm = ApiForm<any, any>();

class AddPeripheral extends React.Component<PInner, State> {
  state: State = {
    open: false,
    done: false,
    peripheralDefinition: null,
  };

  handleClose = () => {
    this.setState({ open: false, done: false, peripheralDefinition: null });
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  selectPeripheralDefinition(peripheralDefinition: schemas["PeripheralDefinition"]) {
    this.setState({ peripheralDefinition });
  }

  send(formData: any) {
    const { configuration } = this.props;

    return api.createPeripheral({
      configurationId: configuration.id,
      newPeripheral: {
        ...formData,
        peripheralDefinitionId: this.state.peripheralDefinition!.id,
      },
    });
  }

  onResponse(response: Response<schemas["Peripheral"]>) {
    const { kit, configuration } = this.props;
    this.props.peripheralCreated({
      serial: kit.serial,
      configurationId: configuration.id,
      peripheral: response.data,
    });
    this.setState({ done: true });
  }

  render() {
    const { t } = this.props;

    let content;
    const def = this.state.peripheralDefinition;

    if (this.state.done) {
      content = (
        <>
          <Header size="huge" icon textAlign="center">
            <Transition animation="drop" duration={450} transitionOnMount>
              <Icon name="check" circular />
            </Transition>
            <Header.Content>Success!</Header.Content>
          </Header>
          <Container textAlign="center">
            <p>The peripheral has been added.</p>
          </Container>
        </>
      );
    } else if (def !== null) {
      const schema: JSONSchema7 = {
        type: "object",
        title: "Peripheral",
        required: ["name", "configuration"],
        properties: {
          name: { type: "string", title: t("common.name") },
          configuration: def.configurationSchema,
        },
      };
      content = (
        <>
          <PeripheralForm
            schema={schema}
            uiSchema={{}}
            send={this.send.bind(this)}
            onResponse={this.onResponse.bind(this)}
            transform={(formData) => ({
              ...formData,
              peripheralDefinitionId: def.id,
            })}
          />
        </>
      );
    } else {
      content = (
        <>
          <Header size="small">
            Please select the type of peripheral to add.
          </Header>
          <Card.Group centered>
            {Object.keys(this.props.peripheralDefinitions).map((id) => {
              const def = this.props.peripheralDefinitions[id]!;
              return (
                <PeripheralDefinitionCard
                  key={def.id}
                  peripheralDefinition={def}
                  onClick={() => this.selectPeripheralDefinition(def)}
                />
              );
            })}
          </Card.Group>
        </>
      );
    }

    const closeEasily =
      this.state.done || this.state.peripheralDefinition === null;

    return (
      <Modal
        trigger={
          <Button primary onClick={this.handleOpen}>
            Add a peripheral
          </Button>
        }
        closeOnEscape={closeEasily}
        closeOnDimmerClick={closeEasily}
        open={this.state.open}
        onClose={this.handleClose}
      >
        <Modal.Header>Add a peripheral</Modal.Header>
        <Modal.Content>{content}</Modal.Content>
        <Modal.Actions>
          {this.state.done ? (
            <Button color="green" onClick={this.handleClose}>
              <Icon name="checkmark" /> Neat!
            </Button>
          ) : (
            <Button color="red" onClick={this.handleClose}>
              Cancel
            </Button>
          )}
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    peripheralDefinitions: peripheralDefinitionsSelectors.selectEntities(state),
  };
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      peripheralCreated,
    },
    dispatch
  );

export default compose<PInner, Props>(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation()
)(AddPeripheral);
