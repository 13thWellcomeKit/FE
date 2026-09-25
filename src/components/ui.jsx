// 페이지들이 함께 쓰는 틀과 기본 컨트롤. 새 화면은 여기 조각을 조합해서 만든다.
import styled, { css } from "styled-components";
import Header from "./Header";
import { bp, color, font, radius, size } from "../theme";

const Main = styled.main`
  width: 100%;
  max-width: 72rem;
  margin: 0 auto;
  padding: 3rem 3rem 5rem;

  @media (max-width: ${bp.tablet}) {
    padding: 1.75rem 1rem 4rem;
  }
`;

export function Page({ children, narrow }) {
  return (
    <>
      <Header />
      <Main style={narrow ? { maxWidth: "30rem" } : undefined}>{children}</Main>
    </>
  );
}

const HeadRow = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 1.25rem;
  margin-bottom: 2.5rem;
`;

export const PageTitle = styled.h1`
  font-family: ${(p) => (p.$display ? font.display : font.body)};
  font-weight: ${(p) => (p.$display ? 800 : 700)};
  font-size: ${(p) => (p.$display ? size.x4 : size.x3)};
  line-height: 1.1;
  letter-spacing: ${(p) => (p.$display ? "-0.02em" : "-0.01em")};

  @media (max-width: ${bp.tablet}) {
    font-size: ${(p) => (p.$display ? size.x3 : size.x2)};
  }
`;

export const Lead = styled.p`
  margin-top: 0.75rem;
  max-width: 36rem;
  color: ${color.muted};
  font-size: ${size.lg};
  line-height: 1.55;

  @media (max-width: ${bp.tablet}) {
    font-size: ${size.md};
  }
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

// title이 영문 슬로건이면 display로 Montserrat를 쓴다.
export function PageHead({ title, display, description, actions }) {
  return (
    <HeadRow>
      <div>
        <PageTitle $display={display}>{title}</PageTitle>
        {description && <Lead>{description}</Lead>}
      </div>
      {actions && <Actions>{actions}</Actions>}
    </HeadRow>
  );
}

export const Panel = styled.section`
  background: ${color.surface};
  border: 1px solid ${color.line};
  border-radius: ${radius.panel};
  padding: 2rem;

  @media (max-width: ${bp.tablet}) {
    padding: 1.25rem;
  }
`;

export const PanelTitle = styled.h2`
  font-size: ${size.lg};
  font-weight: 700;
  margin-bottom: 1.25rem;
`;

const buttonVariants = {
  primary: css`
    background: ${color.brand};
    color: ${color.ink};
    border-color: ${color.brand};
    &:hover:not(:disabled) {
      background: ${color.brandDeep};
      border-color: ${color.brandDeep};
    }
  `,
  secondary: css`
    background: transparent;
    color: ${color.text};
    border-color: ${color.line};
    &:hover:not(:disabled) {
      border-color: ${color.text};
    }
  `,
  ghost: css`
    background: transparent;
    color: ${color.muted};
    border-color: transparent;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    &:hover:not(:disabled) {
      color: ${color.text};
    }
  `,
};

export const Button = styled.button.attrs((p) => ({ type: p.type || "button" }))`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  min-height: 3rem;
  padding: 0 1.5rem;
  border: 1.5px solid transparent;
  border-radius: ${radius.pill};
  font-size: ${size.md};
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
  ${(p) => buttonVariants[p.$variant || "primary"]}
  ${(p) => p.$block && "width: 100%;"}

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

const FieldWrap = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: ${size.sm};
  font-weight: 600;
  color: ${color.muted};
`;

export const Input = styled.input`
  height: 3.25rem;
  padding: 0 1rem;
  border-radius: ${radius.control};
  border: 1.5px solid ${(p) => (p.$invalid ? color.danger : color.line)};
  background: ${color.raised};
  color: ${color.text};
  font-size: ${size.md};
  font-weight: 400;

  &::placeholder {
    color: #7a746c;
  }
  &:focus {
    outline: none;
    border-color: ${color.brand};
  }
`;

export const ErrorText = styled.p`
  color: ${color.danger};
  font-size: ${size.sm};
  font-weight: 500;
`;

export function Field({ label, error, ...inputProps }) {
  return (
    <FieldWrap>
      {label}
      <Input $invalid={!!error} {...inputProps} />
      {error && <ErrorText role="alert">{error}</ErrorText>}
    </FieldWrap>
  );
}

export const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.$gap || "1.25rem"};
`;

export const Muted = styled.p`
  color: ${color.muted};
`;

// 성공/실패 결과 한 줄
export const Notice = styled.p`
  padding: 0.875rem 1.125rem;
  border-radius: ${radius.control};
  border: 1px solid
    ${(p) =>
      p.$tone === "success"
        ? "rgba(12, 163, 12, 0.5)"
        : p.$tone === "error"
        ? "rgba(255, 107, 94, 0.5)"
        : color.line};
  background: ${(p) =>
    p.$tone === "success"
      ? "rgba(12, 163, 12, 0.12)"
      : p.$tone === "error"
      ? "rgba(255, 107, 94, 0.1)"
      : color.raised};
  color: ${color.text};
  font-size: ${size.sm};
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background: rgba(10, 9, 8, 0.72);
`;

export const Dialog = styled.div.attrs({ role: "dialog", "aria-modal": true })`
  width: 100%;
  max-width: ${(p) => p.$width || "24rem"};
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
  padding: 1.75rem;
  border-radius: ${radius.panel};
  background: ${color.surface};
  border: 1px solid ${color.line};
`;

export const StatusDot = styled.span`
  display: inline-block;
  flex-shrink: 0;
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 50%;
  background: ${(p) => p.$color};
`;
