import React, { useEffect, useRef } from "react";
import Jazzicon from "@metamask/jazzicon";
import styled from "@emotion/styled";

type Props = {
  size?: number,
  account: string,
}

const StyledIdenticon = styled.div`
  height: fit-content;
  line-height: 0;
  border-radius: 50%;
  background-color: black;
`;

export default function AccountIcon({ size, account }: Props) {
  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    if (account && ref.current) {
      ref.current.innerHTML = "";
      ref.current.appendChild(Jazzicon(size || 16, parseInt(account.slice(2, 10), 16)));
    }
  }, [account, size]);

  return <StyledIdenticon ref={ref as any} />;
}

AccountIcon.defaultProps = {
  size: 16,
}
