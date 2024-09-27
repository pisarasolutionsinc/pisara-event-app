import VotersTable from "./VotersTable";
import VotersTableRow from "./VotersTableRow";

interface VotersTableContainerProps {
  voters: any[];
  expandedPage: boolean;
  expandedRows: string[];
  selectedVoter: any;
  handleOpenExpandedPage: (voter: any) => void;
  toggleRow: (id: string, voter: any) => void;
  getInitials: (name: string) => string;
}

const VotersTableContainer = ({
  voters,
  expandedPage,
  expandedRows,
  selectedVoter,
  handleOpenExpandedPage,
  toggleRow,
  getInitials,
}: VotersTableContainerProps) => {
  const headers = ["Name", "Age", "Sex", "Type", "Status", "Actions"];

  return (
    <VotersTable headers={headers} expandedPage={expandedPage}>
      {voters.map((voter) => (
        <VotersTableRow
          key={voter._id}
          voter={voter}
          expandedPage={expandedPage}
          expandedRows={expandedRows}
          selectedVoter={selectedVoter}
          handleOpenExpandedPage={handleOpenExpandedPage}
          toggleRow={toggleRow}
          getInitials={getInitials}
        />
      ))}
    </VotersTable>
  );
};

export default VotersTableContainer;
