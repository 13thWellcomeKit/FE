import styled from "styled-components";
import { ReactComponent as TitleLogo } from "../svg/TitleLogo.svg";
import { ReactComponent as Menu } from "../svg/Menu.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { bp, color, size } from "../theme";

const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 900;
  background: ${color.ink};
  border-bottom: 1px solid ${color.line};
`;

const Inner = styled.div`
  max-width: 72rem;
  height: 4.5rem;
  margin: 0 auto;
  padding: 0 3rem;
  display: flex;
  align-items: center;
  gap: 2.5rem;

  @media (max-width: ${bp.tablet}) {
    height: 3.75rem;
    padding: 0 1rem;
    justify-content: space-between;
  }
`;

const LogoButton = styled.button`
  display: flex;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;

  flex-shrink: 0;

  svg {
    display: block;
    height: 1.75rem;
    width: auto;
    max-width: 11rem;
  }
`;

const Nav = styled.nav`
  display: flex;
  flex: 1;
  gap: 0.25rem;

  @media (max-width: ${bp.tablet}) {
    display: none;
  }
`;

const Right = styled(Nav)`
  flex: 0;
`;

const NavLink = styled.button`
  position: relative;
  padding: 0.5rem 0.75rem;
  border: none;
  background: none;
  color: ${(p) => (p.$active ? color.text : color.muted)};
  font-size: ${size.md};
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    color: ${color.text};
  }

  &::after {
    content: "";
    position: absolute;
    left: 0.75rem;
    right: 0.75rem;
    bottom: -1.3rem;
    height: 2px;
    background: ${(p) => (p.$active ? color.brand : "transparent")};
  }
`;

const MenuButton = styled.button`
  display: none;
  flex-shrink: 0;
  margin-left: auto;
  padding: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }

  @media (max-width: ${bp.tablet}) {
    display: flex;
  }
`;

const Sheet = styled.div`
  position: fixed;
  inset: 3.75rem 0 0 0;
  z-index: 950;
  background: ${color.ink};
  padding: 1rem;
  display: flex;
  flex-direction: column;
`;

const SheetLink = styled.button`
  padding: 1.1rem 0.25rem;
  border: none;
  border-bottom: 1px solid ${color.line};
  background: none;
  text-align: left;
  color: ${(p) => (p.$active ? color.brand : color.text)};
  font-size: ${size.xl};
  font-weight: 700;
  cursor: pointer;
`;

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn, isAdmin, logout } = useAuth();

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const go = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    alert("로그아웃했습니다.");
    go("/");
  };

  const links = [
    { path: "/introduce", label: "멋사 소개" },
    { path: "/check", label: "출석" },
    { path: "/bingo", label: "빙고" },
    ...(isAdmin ? [{ path: "/admin/attendance", label: "출석 통계" }] : []),
  ];
  const isActive = (path) => location.pathname === path;

  return (
    <Bar>
      <Inner>
        <LogoButton onClick={() => go("/")} aria-label="홈으로">
          <TitleLogo />
        </LogoButton>
        <Nav aria-label="주 메뉴">
          {links.map((l) => (
            <NavLink key={l.path} $active={isActive(l.path)} onClick={() => go(l.path)}>
              {l.label}
            </NavLink>
          ))}
        </Nav>
        <Right>
          {isLoggedIn ? (
            <>
              <NavLink $active={isActive("/mypage")} onClick={() => go("/mypage")}>
                마이페이지
              </NavLink>
              <NavLink onClick={handleLogout}>로그아웃</NavLink>
            </>
          ) : (
            <NavLink $active={isActive("/login")} onClick={() => go("/login")}>
              로그인
            </NavLink>
          )}
        </Right>
        <MenuButton
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <span style={{ fontSize: "1.5rem", lineHeight: 1 }}>×</span> : <Menu />}
        </MenuButton>
      </Inner>

      {isMenuOpen && (
        <Sheet>
          <SheetLink $active={isActive("/")} onClick={() => go("/")}>
            홈
          </SheetLink>
          {links.map((l) => (
            <SheetLink key={l.path} $active={isActive(l.path)} onClick={() => go(l.path)}>
              {l.label}
            </SheetLink>
          ))}
          {isLoggedIn ? (
            <>
              <SheetLink $active={isActive("/mypage")} onClick={() => go("/mypage")}>
                마이페이지
              </SheetLink>
              <SheetLink onClick={handleLogout}>로그아웃</SheetLink>
            </>
          ) : (
            <SheetLink onClick={() => go("/login")}>로그인</SheetLink>
          )}
        </Sheet>
      )}
    </Bar>
  );
}
