import styled, { keyframes } from 'styled-components';

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

export const Form = styled.form`
  border: 5px solid white;
  padding: 20px 0;
  line-height: 1.5;
  label {
    display: block;
    margin-bottom: 1rem;
  }
  input,
  textarea,
  select {
    width: 100%;
    padding: 1rem 0.5rem;
    border: 1px solid lightgrey;
    margin-top: 5px;
  }
  button,
  input[type='submit'] {
    width: auto;
    background: blue;
    color: white;
    border: 0;
    font-weight: 600;
    padding: 0.5rem 1.2rem;
  }
  fieldset {
    border: 0;
    padding: 0;
    &[disabled] {
      opacity: 0.5;
    }
  }
`;
