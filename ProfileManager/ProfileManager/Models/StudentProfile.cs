using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProfileManager.Models
{// Model class for student profile
    public class StudentProfile
    {
        [JsonProperty("id")]
        public Guid Id { get; set; }

        [JsonProperty("StudentId")]
        public string StudentId { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("email")]
        public string Email { get; set; }
    }


}
