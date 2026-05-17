import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [leads, setLeads] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [leadStatus, setLeadStatus] =
    useState("new");
  const [source, setSource] =
    useState("website");



  // FETCH LEADS
  const fetchLeads = async () => {
    try {
      const response = await axios.get(
        `https://smart-leads-api-e9gj.onrender.com/api/leads?search=${search}&status=${status}`
      );

      setLeads(response.data.leads);

    } catch (error) {
      console.log(error);
    }
  };



  useEffect(() => {
    fetchLeads();
  }, [search, status]);



  // CREATE LEAD
  const createLead = async () => {
    try {
      await axios.post(
        "https://smart-leads-api-e9gj.onrender.com/api/leads",
        {
          name,
          email,
          status: leadStatus,
          source,
        }
      );

      fetchLeads();

      setName("");
      setEmail("");
      setLeadStatus("new");
      setSource("website");

    } catch (error) {
      console.log(error);
    }
  };



  // DELETE LEAD
  const deleteLead = async (id: string) => {
    try {
      await axios.delete(
        `https://smart-leads-api-e9gj.onrender.com/api/leads/${id}`
      );

      fetchLeads();

    } catch (error) {
      console.log(error);
    }
  };



  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-4xl font-bold mb-6">
        Smart Leads Dashboard
      </h1>



      {/* ADD LEAD */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">

        <h2 className="text-2xl font-bold mb-4">
          Add Lead
        </h2>

        <div className="grid grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="border p-3 rounded"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="border p-3 rounded"
          />

          <select
            value={leadStatus}
            onChange={(e) =>
              setLeadStatus(e.target.value)
            }
            className="border p-3 rounded"
          >
            <option value="new">New</option>
            <option value="qualified">
              Qualified
            </option>
            <option value="contacted">
              Contacted
            </option>
            <option value="lost">Lost</option>
          </select>

          <select
            value={source}
            onChange={(e) =>
              setSource(e.target.value)
            }
            className="border p-3 rounded"
          >
            <option value="website">
              Website
            </option>

            <option value="instagram">
              Instagram
            </option>

            <option value="referral">
              Referral
            </option>
          </select>

        </div>

        <button
          onClick={createLead}
          className="mt-4 bg-blue-600 text-white px-6 py-3 rounded"
        >
          Add Lead
        </button>

      </div>



      {/* SEARCH + FILTER */}
      <div className="bg-white p-6 rounded-xl shadow">

        <div className="flex gap-4 mb-6">

          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="border p-3 rounded w-full"
          />

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            className="border p-3 rounded"
          >
            <option value="">All</option>
            <option value="new">New</option>
            <option value="qualified">
              Qualified
            </option>
            <option value="contacted">
              Contacted
            </option>
            <option value="lost">Lost</option>
          </select>

        </div>



        {/* TABLE */}
        <table className="w-full">

          <thead>
            <tr className="border-b">

              <th className="text-left p-3">
                Name
              </th>

              <th className="text-left p-3">
                Email
              </th>

              <th className="text-left p-3">
                Status
              </th>

              <th className="text-left p-3">
                Source
              </th>

              <th className="text-left p-3">
                Actions
              </th>

            </tr>
          </thead>



          <tbody>

            {leads.map((lead) => (
              <tr
                key={lead._id}
                className="border-b"
              >

                <td className="p-3">
                  {lead.name}
                </td>

                <td className="p-3">
                  {lead.email}
                </td>

                <td className="p-3">
                  {lead.status}
                </td>

                <td className="p-3">
                  {lead.source}
                </td>

               <td className="p-3 flex gap-2">

  <button
    onClick={async () => {
      const updatedName = prompt(
        "Enter new name",
        lead.name
      );

      if (!updatedName) return;

      try {
        await axios.put(
          `https://smart-leads-api-e9gj.onrender.com/api/leads/${lead._id}`,
          {
            ...lead,
            name: updatedName,
          }
        );

        fetchLeads();

      } catch (error) {
        console.log(error);
      }
    }}
    className="bg-yellow-500 text-white px-3 py-1 rounded"
  >
    Edit
  </button>

  <button
    onClick={() =>
      deleteLead(lead._id)
    }
    className="bg-red-500 text-white px-3 py-1 rounded"
  >
    Delete
  </button>

</td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Dashboard;