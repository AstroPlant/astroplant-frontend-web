import React from "react";
import { Segment, Placeholder } from "semantic-ui-react";

export type Props = {
  fluid?: boolean;
  header?: boolean;
  paragraph?: boolean;
};

const PlaceholderSegment = (props: Props) => (
  <Segment raised>
    <Placeholder fluid={props.fluid}>
      {props.header && (
        <Placeholder.Header image>
          <Placeholder.Line />
          <Placeholder.Line />
        </Placeholder.Header>
      )}
      {props.paragraph && (
        <Placeholder.Paragraph>
          <Placeholder.Line />
          <Placeholder.Line />
        </Placeholder.Paragraph>
      )}
    </Placeholder>
  </Segment>
);
PlaceholderSegment.defaultProps = {
  header: true,
  paragraph: true
};

export default PlaceholderSegment;
