import { Flex, Grid } from "@chakra-ui/react";

import { useVotingContext } from "src/packages/features/voting-context";

import BaseButton from "../BaseButton";

import { NumericButton } from "./NumericButton";

const digitList = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

export default function InputPanel() {
  const {
    isBlankSelected,
    updateVoteInput,
    blankHandler,
    confirmHandler,
    clearHandler,
  } = useVotingContext();
  return (
    <Flex
      h="100%"
      direction="column"
      justifyContent="center"
      backgroundColor="#D9D9D9"
      borderRadius=".625rem"
    >
      <Flex
        h="100%"
        direction="column"
        alignItems="center"
        justifyContent="center"
        px="4rem"
        backgroundColor="#D9D9D9"
        borderRadius=".625rem"
        gap="4rem"
      >
        <Grid
          templateColumns="repeat(3, 1fr)"
          h="50%"
          w="100%"
          gap="1.75rem"
          justifyItems="center"
          alignContent="center"
          fontFamily="Inter"
          fontWeight="normal"
          fontSize="1.1rem"
          cursor={`${isBlankSelected && "not-allowed"}`}
        >
          {digitList.map((num) => (
            <NumericButton key={num} clickHandler={updateVoteInput}>
              {num}
            </NumericButton>
          ))}
        </Grid>
        <Flex
          w="100%"
          alignItems="flex-end"
          justifyContent="space-between"
          gap="6"
        >
          <BaseButton
            clickHandler={blankHandler}
            text="Branco"
            variant="blank"
          />
          <BaseButton
            clickHandler={clearHandler}
            text="Corrige"
            variant="correct"
          />
          <BaseButton
            clickHandler={confirmHandler}
            text="Confirma"
            variant="confirm"
          />
        </Flex>
      </Flex>
    </Flex>
  );
}