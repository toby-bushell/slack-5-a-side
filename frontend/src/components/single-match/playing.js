import React from 'react';
import { Items, Row, RowHeader } from '../styles/list';
import {
  Accordion,
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody
} from 'react-accessible-accordion';
import PlayersList from '../players/players-list';

const Playing = ({ matchData }) => {
  return (
    <Accordion>
      <AccordionItem>
        <AccordionItemTitle>
          <Row>
            <p>
              Players Playing (
              {matchData.players && matchData.players.length > 0
                ? matchData.players.length
                : 0}
              )
            </p>
          </Row>
        </AccordionItemTitle>
        <AccordionItemBody>
          <PlayersList
            players={matchData.players}
            removePossible={true}
            matchId={matchData.id}
          />
        </AccordionItemBody>
      </AccordionItem>
    </Accordion>
  );
};

export default Playing;
