import React from "react";
import { compose } from "recompose";
import { connect } from "react-redux";
import { withTranslation, WithTranslation } from "react-i18next";
import {
  Container,
  Modal,
  Card,
  Header,
  Button,
  Icon,
  Transition
} from "semantic-ui-react";

import { RootState } from "types";
import { KitState } from "modules/kit/reducer";
import {
  KitsApi,
  KitConfigurationWithPeripherals,
  PeripheralDefinition,
  Peripheral
} from "astroplant-api";
import { AuthConfiguration } from "utils/api";

import { JSONSchema6 } from "json-schema";
import ApiForm from "Components/ApiForm";

type State = {
  open: boolean;
  done: boolean;
  peripheralDefinition: PeripheralDefinition | null;
};

export type Props = {
  kit: KitState;
  configuration: KitConfigurationWithPeripherals;
};

type PInner = Props &
  WithTranslation & {
    peripheralDefinitions: { [id: string]: PeripheralDefinition };
  };

const PeripheralForm = ApiForm<any, any>();

class AddPeripheral extends React.Component<PInner, State> {
  state: State = {
    open: false,
    done: false,
    peripheralDefinition: null
  };

  handleClose = () => {
    this.setState({ open: false, done: false, peripheralDefinition: null });
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  selectPeripheralDefinition(peripheralDefinition: PeripheralDefinition) {
    this.setState({ peripheralDefinition });
  }

  send(formData: any) {
    const { kit, configuration } = this.props;

    const api = new KitsApi(AuthConfiguration.Instance);
    return api.createPeripheral({
      kitSerial: kit.details.serial,
      configurationId: configuration.id,
      newPeripheral: {
        ...formData,
        peripheralDefinitionId: this.state.peripheralDefinition!.id
      }
    });
  }

  onResponse(response: Peripheral) {
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
      const schema: JSONSchema6 = {
        type: "object",
        title: "Peripheral",
        required: ["name", "configuration"],
        properties: {
          name: { type: "string", title: t("common.name") },
          configuration: def.configurationSchema
        }
      };
      content = (
        <>
          <PeripheralForm
            schema={schema}
            uiSchema={{}}
            send={this.send.bind(this)}
            onResponse={this.onResponse.bind(this)}
            transform={formData => ({
              ...formData,
              peripheralDefinitionId: def.id
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
            {Object.keys(this.props.peripheralDefinitions).map(id => {
              const def = this.props.peripheralDefinitions[id];
              return (
                <Card
                  key={id}
                  color="blue"
                  link
                  onClick={() => this.selectPeripheralDefinition(def)}
                >
                  <Card.Content>
                    <Card.Header>{def.name}</Card.Header>
                    {def.description && (
                      <Card.Description>{def.description}</Card.Description>
                    )}
                    <Card.Meta>
                      {def.brand} - {def.model}
                    </Card.Meta>
                  </Card.Content>
                </Card>
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
    peripheralDefinitions: state.peripheralDefinition.definitions
  };
};

export default compose<PInner, Props>(
  connect(mapStateToProps),
  withTranslation()
)(AddPeripheral);
