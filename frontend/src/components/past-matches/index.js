import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Items, Row, RowHeader } from '../styles/list';
import { Container } from '../styles/containers';
import { formatToDay } from '../../utils/format-time';
import { Link } from '@reach/router';
import {
  Accordion,
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody
} from 'react-accessible-accordion';
import PlayersList from '../players/players-list';
import moment from 'moment';

const PAST_MATCHES_QUERY = gql`
  query PAST_MATCHES_QUERY($currentTime: DateTime!) {
    matches(where: { time_lt: $currentTime }, orderBy: time_DESC) {
      id
      time
      players {
        id
        name
        username
        image
      }
    }
  }
`;

class Matches extends Component {
  render() {
    return (
      <div>
        <Query
          query={PAST_MATCHES_QUERY}
          variables={{ currentTime: moment().startOf('day') }}
        >
          {({ data, error, loading }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error: {error.message}</p>;

            return (
              <Container>
                <h3>Past Matches</h3>
                <Items>
                  <RowHeader>
                    <p>ID</p>
                    <p>Time</p>
                  </RowHeader>
                  <Accordion>
                    {data.matches.map(match => (
                      <AccordionItem key={match.id}>
                        <AccordionItemTitle>
                          <Row key={match.id}>
                            <p>{match.id}</p>
                            <p>{formatToDay(match.time)}</p>
                          </Row>
                        </AccordionItemTitle>
                        <AccordionItemBody>
                          <PlayersList players={match.players} />
                          <Link to={`/match/${match.id}`}>Edit Match</Link>
                        </AccordionItemBody>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </Items>
              </Container>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default Matches;
export { PAST_MATCHES_QUERY };
