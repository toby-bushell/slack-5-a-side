import styled from 'styled-components';

export const Items = styled.div`
  display: grid;
  grid-column-gap: 20px;
  grid-row-gap: 20px;
  text-align: left;
`;

export const Row = styled.div`
  border-bottom: 1px solid lightgrey;
  display: grid;
  grid-column-gap: 20px;
  grid-template-columns: 2fr 1fr;
`;

export const RowHeader = styled(Row)`
  font-weight: bold;
`;
