using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using ProfileManager.Models;
using System.IO;
using System.Net;
using System.Threading.Tasks;

namespace ProfileManager;

public class FileSearchAPI
{
    private readonly ILogger<FileSearchAPI> _logger;

    public FileSearchAPI(ILogger<FileSearchAPI> logger)
    {
        _logger = logger;
    }

    [Function("SearchStudentProfile")]
    public async Task<HttpResponseData> RunAsync(
     [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "students/{id?}")] HttpRequestData req,
      FunctionContext context)
    {   
        var client = new CosmosClient(
            Environment.GetEnvironmentVariable("CosmosDbEndpoint"),
            Environment.GetEnvironmentVariable("CosmosDbKey")
        );
        var container = client.GetContainer(
            Environment.GetEnvironmentVariable("CosmosDbDatabaseName"),
            Environment.GetEnvironmentVariable("CosmosDbContainerName")
        );
        
        string id = null;
        
        if (context.BindingContext.BindingData.TryGetValue("id", out var idValue))
        {
            id = idValue?.ToString();
        }



        if (string.IsNullOrEmpty(id))
        {
            // Return all students
            var query = new QueryDefinition("SELECT * FROM c");
            var iterator = container.GetItemQueryIterator<StudentProfile>(query);

            var students = new List<StudentProfile>();
            while (iterator.HasMoreResults)
            {
                var results = await iterator.ReadNextAsync();
                students.AddRange(results);
            }

            var okResponse = req.CreateResponse(HttpStatusCode.OK);
            await okResponse.WriteAsJsonAsync(students);
            return okResponse;
        }
        else
        {
            // Return single student
            var query = new QueryDefinition("SELECT * FROM c WHERE c.id = @id")
                .WithParameter("@id", id);

            var iterator = container.GetItemQueryIterator<StudentProfile>(query);
            var results = await iterator.ReadNextAsync();
            var student = results.FirstOrDefault();

            if (student == null)
            {
                var notFoundResponse = req.CreateResponse(HttpStatusCode.NotFound);
                await notFoundResponse.WriteStringAsync("Student profile not found.");
                return notFoundResponse;
            }

            var okResponse = req.CreateResponse(HttpStatusCode.OK);
            await okResponse.WriteAsJsonAsync(student);
            return okResponse;
        }

    }
}