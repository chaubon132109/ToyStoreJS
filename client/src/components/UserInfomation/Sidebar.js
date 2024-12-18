import styled from "styled-components";

const Sidebar = styled.div`
  margin-top: 20px;
  margin-left: 350px;
  width: 300px;
  min-height: 500px;
  border-right: 2px solid #e0e0e0;
`;

const Menu = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const MenuItem = styled.li`
  padding: 20px;
  margin-bottom: 15px;
  a {
    font-size: 20px;
    color: black;
    text-decoration: none;
  }
  &:hover a {
    color: #f04e47;
  }
`;
export const SidebarUI = () => {
  return (
    <Sidebar>
      <Menu>
        <MenuItem>
          <a href="/user">NGƯỜI DÙNG</a>
        </MenuItem>
        <MenuItem>
          <a href="/my-info">Xem TTCN</a>
        </MenuItem>
        <MenuItem>
          <a href="/my-order">Lịch sử mua hàng</a>
        </MenuItem>
        <MenuItem>
          <a href="/comment-history">Lịch sử bình luận</a>
        </MenuItem>
      </Menu>
    </Sidebar>
  );
};
