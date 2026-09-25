import { createGlobalStyle } from "styled-components";
import { color, font } from "./theme";

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }

  html { -webkit-text-size-adjust: 100%; }

  body {
    margin: 0;
    background: ${color.ink};
    color: ${color.text};
    font-family: ${font.body};
    line-height: 1.6;
    word-break: keep-all;
    -webkit-font-smoothing: antialiased;
  }

  h1, h2, h3, p { margin: 0; }

  button, input, select { font: inherit; color: inherit; }

  :focus-visible {
    outline: 2px solid ${color.brand};
    outline-offset: 2px;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  ::selection { background: ${color.brand}; color: ${color.ink}; }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

export default GlobalStyle;
