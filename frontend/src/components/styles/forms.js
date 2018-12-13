import styled from 'styled-components';

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
