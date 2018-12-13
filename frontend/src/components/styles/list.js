import styled from 'styled-components';
import { Button } from './buttons';

export const Items = styled.div`
  text-align: left;
  margin-bottom: 20px;

  .accordion__body {
    font-size: 0.9em;
    padding: 20px;
    background-color: #f3f3f3;

    h1,
    h2,
    h3,
    h4 {
      margin-top: 0;
    }
  }
`;

export const Row = styled.div`
  border-bottom: 1px solid lightgrey;
  display: grid;
  grid-column-gap: 20px;
  grid-template-columns: 2fr 1fr 150px;
  padding: 10px;

  p {
    margin: 0;
  }

  ${Button} {
    font-size: small;
    float: right;
  }
`;

export const RowHeader = styled(Row)`
  font-weight: bold;
`;
