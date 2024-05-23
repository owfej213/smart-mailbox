import Wrapper from "../../components/ui/Wrapper";
import Container from "../../components/ui/Container";
import {
  Button,
  Card,
  CardBody,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";
import { useAuth } from "../../components/Context/AuthContext";
import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import SubTitle from "../../components/ui/SubTitle";
import Icon from "../../components/ui/Icon";
import { useUserData } from "../../components/Context/UserDataContext";
function Setting() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formUserName, setFormUserName] = useState("");
  const [formUserRealName, setFormUserRealName] = useState("");
  const [formMailBoxID, setFormMailBoxID] = useState("");
  const { userData } = useUserData();
  const { userName, userRealName, mailBoxID } = userData || {};

  useEffect(() => {
    setFormUserName(userName);
    setFormUserRealName(userRealName);
    setFormMailBoxID(mailBoxID);
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    async function UserDataUpdate() {
      try {
        if (currentUser) {
          setLoading(true);

          const userDocRef = doc(db, `users/${currentUser.uid}`);

          if (formUserName) updateDoc(userDocRef, { userName: formUserName });
          if (formUserRealName) updateDoc(userDocRef, { userRealName: formUserRealName });
          if (formMailBoxID) updateDoc(userDocRef, { mailBoxID: formMailBoxID });

          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
    UserDataUpdate();
  };

  return (
    <>
      <Wrapper>
        <Flex w="150px" direction="column">
          <SubTitle textAlign="left" size="2xl">設定</SubTitle>
          <VStack align="flex-start">
            <Button
              color="white"
              bg="none"
              h="8"
              leftIcon={<Icon name="UserCog" color="white" />}
              _hover={{
                bg: "gray.500",
              }}
            >
              帳戶
            </Button>
            <Button
              color="white"
              bg="none"
              h="8"
              leftIcon={<Icon name="BellDot" color="white" />}
              _hover={{
                bg: "gray.500",
              }}
            >
              通知
            </Button>
          </VStack>
        </Flex>
        <Container w="600px">
          <Card variant="setting">
            <CardBody>
              <form onSubmit={onSubmit}>
                <VStack align="flex-start">
                  <FormControl>
                    <FormLabel>使用者名稱</FormLabel>
                    <Input
                      maxLength={20}
                      value={formUserName}
                      onChange={(e) => {
                        setFormUserName(e.target.value);
                      }}
                    />
                    <FormHelperText color="gray.700">帳戶登入與顯示</FormHelperText>
                  </FormControl>
                  <FormControl>
                    <FormLabel>真實姓名</FormLabel>
                    <Input
                      maxLength={20}
                      value={formUserRealName}
                      onChange={(e) => {
                        setFormUserRealName(e.target.value);
                      }}
                    />
                    <FormHelperText color="gray.700">確保能夠寄送通知</FormHelperText>
                  </FormControl>
                  <FormControl>
                    <FormLabel>郵箱ID</FormLabel>
                    <Input
                      value={formMailBoxID}
                      onChange={(e) => {
                        setFormMailBoxID(e.target.value);
                      }}
                    />
                  </FormControl>
                  <Button
                    isDisabled={loading}
                    isLoading={loading}
                    type="submit"
                    mt="4"
                    colorScheme="blue"
                  >
                    儲存全部
                  </Button>
                </VStack>
              </form>
            </CardBody>
          </Card>
        </Container>
      </Wrapper>
    </>
  );
}

export default Setting;
