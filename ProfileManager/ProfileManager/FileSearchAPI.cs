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
     [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "students/{id}")] HttpRequestData req, FunctionContext context)
    {
        var id = context.BindingContext.BindingData["id"]?.ToString();
        if (string.IsNullOrEmpty(id))
        {
            var badResponse = req.CreateResponse(HttpStatusCode.BadRequest);
            await badResponse.WriteStringAsync("Student id is required.");
            return badResponse;
        }


        var client = new CosmosClient(
            Environment.GetEnvironmentVariable("CosmosDbEndpoint"),
            Environment.GetEnvironmentVariable("CosmosDbKey")
        );
        var container = client.GetContainer(
            Environment.GetEnvironmentVariable("CosmosDbDatabaseName"),
            Environment.GetEnvironmentVariable("CosmosDbContainerName")
        );

        try
        {
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
        catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
        {
            var notFound = req.CreateResponse(HttpStatusCode.NotFound);
            await notFound.WriteStringAsync("Student profile not found.");
            return notFound;
        }


    }
}