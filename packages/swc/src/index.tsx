import LoginForm from "./PageForm";
import { css } from "@emotion/react";

const leftCss = css`
  height: 100%;
  display: flex;
`;

const formWrapCss = css`
  flex: 1;
  display: flex;
  align-items: center;
`;

const Login = () => {
    return (
        <div css={leftCss}>
            <div
                css={(theme) => css`
          flex: 0 1 480px;
          background: ${theme.colors.primary};
        `}
            >
                left
            </div>
            <div css={formWrapCss}>
                <LoginForm />
            </div>
        </div>
    );
};

export default Login;
