import {
  useState,
  createContext,
  useContext,
  useMemo,
  useCallback,
} from 'react';

import { ChildrenProps } from '@packages/utils/react';
import {
  GetAvailableElectionsResponse,
  Party,
} from '@packages/entities/notion';
import { electionsApi } from '@packages/repository/api';

interface IVotingCtx {
  parties: Party[];
  availableElections: GetAvailableElectionsResponse;
  voteInput: string;
  selectedPartyData: selectedPartyData | undefined;
  incrementVote: () => void;
  voteBlank: () => void;
  voteClear: () => void;
  voteConfirm: () => void;
  loadParties: (pageId: string) => void;
  loadAvailableElections: (databaseID: string) => void;
  updateVoteInput: (input: string) => void;
}

const defaultInitialState = {
  parties: [],
  availableElections: { message: '' },
  voteInput: '',
  selectedPartyData: undefined,
  incrementVote: () => {},
  voteBlank: () => {},
  voteClear: () => {},
  voteConfirm: () => {},
  loadParties: () => {},
  loadAvailableElections: () => {},
  updateVoteInput: () => {},
};

interface selectedPartyData {
  party: Party;
  candidate: () => {
    name: string;
    img: string;
  };
  vice: () => {
    name: string;
    img: string;
  };
  partyInfo: () => {
    code: string;
    name: string;
    slug: string;
  };
}

const VotingCtx = createContext<IVotingCtx>(defaultInitialState);

function VotingCtxProvider({ children }: ChildrenProps) {
  // TODO separate voting context from election context

  // Election related
  const [availableElections, setAvailableElections] =
    useState<GetAvailableElectionsResponse>(
      defaultInitialState.availableElections,
    );
  const [partyList, setPartyList] = useState<Party[]>(
    defaultInitialState.parties,
  );

  const loadParties = useCallback(async (pageId: string) => {
    const res = await electionsApi.getElectionPage(pageId);
    if (res) {
      setPartyList(res.results);
    }
  }, []);

  const loadAvailableElections = useCallback((databaseID: string) => {
    if (databaseID.length) {
      getData();
    }
    async function getData() {
      const res = await electionsApi.getAvailableElections(databaseID);
      if (res) setAvailableElections(res);
    }
  }, []);

  const incrementVote = useCallback(
    () => (partyCode: number) => {
      const updatedList = partyList.map((party) => {
        if (party.code !== partyCode.toString()) return party;

        return {
          ...party,
          votes: party.votes++,
        };
      });

      setPartyList(updatedList);
    },
    [partyList],
  );
  // end of Election related

  // Voting related
  const [voteInput, setVoteInput] = useState('');
  const secretCode = '12345';

  const updateVoteInput = useCallback(
    (input: string) => {
      if (voteInput.length > 5) return;

      if (input.charCodeAt(0) >= 48 && input.charCodeAt(0) <= 57) {
        setVoteInput(voteInput + input);
      }
    },
    [voteInput],
  );

  // TODO 'are you sure' step

  const voteBlank = useCallback(() => {
    // are you sure???
    console.log('voce votou em branco');
  }, []);
  const voteConfirm = useCallback(() => {
    // are you sure???

    // Check if is end election secret code
    if (voteInput === secretCode) console.log('election ended');

    // success
    console.log('voto com sucesso');
  }, [voteInput]);
  const voteClear = useCallback(() => {
    // are you sure???
    setVoteInput('');
  }, []);

  const selectedPartyData = useMemo(() => {
    return {
      party: partyList.filter((e) => e.code === voteInput.slice(0, 2))[0],
      candidate: function () {
        return {
          name: this.party?.members.candidate.name,
          img: this.party?.members.candidate.image,
        };
      },
      vice: function () {
        return {
          name: this.party?.members.viceCandidate.name,
          img: this.party?.members.viceCandidate.image,
        };
      },
      partyInfo: function () {
        return {
          code: this.party?.code,
          name: this.party?.name,
          slug: this.party?.slug,
        };
      },
    };
  }, [partyList, voteInput]);

  // End of Voting related

  const votingData = useMemo(() => {
    return {
      parties: partyList,
      availableElections: availableElections,
      voteInput: voteInput,
      selectedPartyData: selectedPartyData,
      voteBlank: voteBlank,
      voteConfirm: voteConfirm,
      voteClear: voteClear,
      updateVoteInput: updateVoteInput,
      incrementVote: incrementVote,
      loadParties: loadParties,
      loadAvailableElections: loadAvailableElections,
    };
  }, [
    partyList,
    availableElections,
    selectedPartyData,
    voteInput,
    voteBlank,
    voteConfirm,
    voteClear,
    updateVoteInput,
    incrementVote,
    loadParties,
    loadAvailableElections,
  ]);

  return <VotingCtx.Provider value={votingData}>{children}</VotingCtx.Provider>;
}

export function useVotingContext() {
  return useContext(VotingCtx);
}

export default VotingCtxProvider;
