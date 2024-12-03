import { ContactPerson } from "../interfaces";
import ContactPersonComponent from "./ContactPersonComponent";

type ListContactPersonProp = {
  people?: ContactPerson[];
};

const ListContactPerson = ({ people }: ListContactPersonProp) => {
  return (
    <div>
      <ul className="space-y-0">
        {people?.map((item, index) => (
          <li key={index}>
            <ContactPersonComponent user={item} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListContactPerson;
