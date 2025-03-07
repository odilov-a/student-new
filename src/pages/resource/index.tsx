import React, { useEffect, useState } from "react";

interface ResourceItem {
  _id: string;
  title: string;
  titleUz: string;
  titleRu: string;
  titleEn: string;
  resources: string[];
}

const Resource: React.FC = () => {
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const selectedLang = localStorage.getItem("i18nextLng") || "en";

  useEffect(() => {
    fetch(`${process.env.REACT_APP_ROOT_API}/resources?lang=${selectedLang}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setResources(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching resources:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  const getYouTubeEmbedUrl = (url: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  return (
    <div className="p-4">
      <div className="space-y-6">
        {resources.map((resource) => (
          <div key={resource._id} className="p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{resource.title}</h2>
            <div className="mt-2">
              <h3 className="font-medium">Oddiy linklar:</h3>
              <ul className="list-decimal pl-5">
                {resource.resources.filter(link => !(link.includes("youtube.com") || link.includes("youtu.be"))).map((link, index) => (
                  <li key={index}>
                    <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
              <h3 className="font-medium mt-4">YouTube videolar:</h3>
              <ul className="list-decimal pl-4 flex flex-wrap gap-6">
                {resource.resources.filter(link => link.includes("youtube.com") || link.includes("youtu.be")).map((link, index) => (
                  <li key={index} className="mt-2">
                    <iframe
                      width="360"
                      height="215"
                      src={getYouTubeEmbedUrl(link)}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Resource;