import { Button } from 'antd';
import { sleep } from 'radash';
import React, { useEffect } from 'react';
import { useModal } from 'voyagejs';

const Content = () => {
  useEffect(() => {
    console.log('modal刷新');
  }, []);

  return <div>内容</div>;
};

const Modal = () => {
  const [modal, { open: openModal, close: closeModal }] = useModal();

  return (
    <div>
      {modal}

      <Button
        onClick={() =>
          openModal({
            title: '弹框',
            width: 600,
            children: <Content />,
            onCancel: () => {
              console.log('onCancel');
            },
            onOk: async () => {
              console.log('onOk');
              await sleep(2000);
              closeModal();
            },
          })
        }
      >
        打开弹框
      </Button>
    </div>
  );
};

export default Modal;
