import styled from "@emotion/styled";

export const MenuContainer = styled.div`
  z-index: 99;
  top: 0;
  &.sticky {
    width: 100%;
    background-color: #48a185;
    position: fixed;
    top: 0;
    .mainmenu {
      height: 38px;
      line-height: 38px;
    }
  }
  .menuWrapper {
    display: flex;
    align-items: center;
    max-width: 1600px;
    padding: 0 36px;
    margin: 0 auto;
  }
`;

export const MenuItem = styled.li`
  position: relative;
  a {
    display: block;
    text-decoration: none;
  }
  .mainmenu {
    position: relative;
    height: 46px;
    padding: 0 2px;
    font-size: 16px;
    line-height: 46px;
    margin-left: 40px;
    color: #dfdfdf;
    transition: height 0.3s ease;
    &:hover {
      color: #fff;
      font-weight: 700;
    }
    &.active {
      color: #fff;
      font-weight: 700;
      &::after {
        display: inline-block;
        content: "";
        position: absolute;
        width: 100%;
        background: #fff;
        height: 4px;
        left: 0;
        bottom: 0;
        border-radius: 4px 4px 0 0;
      }
    }
  }
  &:first-of-type {
    .mainmenu {
      margin-left: 0;
    }
  }
  .submenuWrapper {
    display: none;
  }

  &:hover {
    .submenuWrapper {
      display: block;
      position: absolute;
      z-index: 100;
      left: 37px;
      top: 40px;
      background-color: #fff;
      width: 180px;
      border-radius: 4px;
      box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.2);
      overflow: hidden;
      .submenu {
        color: #000;
        padding: 12px 27px;
        line-height: 22px;
        font-size: 14px;
        &:hover {
          background-color: #eee;
        }
      }
    }
  }
`;
