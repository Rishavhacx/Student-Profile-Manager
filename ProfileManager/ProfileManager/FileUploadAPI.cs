using System.IO;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using ProfileManager.Models;
using Microsoft.Azure.Cosmos;

namespace ProfileManager;

public class FileUploadAPI
{
    private readonly ILogger<FileUploadAPI> _logger;

    public FileUploadAPI(ILogger<FileUploadAPI> logger)
    {
        _logger = logger;
    }

    [Function("UploadStudentProfile")]
    public async Task<HttpResponseData> RunAsync(
     [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "students")] HttpRequestData req)
    {
        var requestBody = await new StreamReader(req.Body).ReadToEndAsync();
        var student = JsonConvert.DeserializeObject<StudentProfile>(requestBody);

        if (student == null || string.IsNullOrEmpty(student.StudentId))
        {
            var badResponse = req.CreateResponse(System.Net.HttpStatusCode.BadRequest);
            await badResponse.WriteStringAsync("Invalid student profile data.");
            return badResponse;
        }

        student.Id = Guid.NewGuid();

        var client = new CosmosClient(
            Environment.GetEnvironmentVariable("CosmosDbEndpoint"),
            Environment.GetEnvironmentVariable("CosmosDbKey")
        );
        var container = client.GetContainer(
            Environment.GetEnvironmentVariable("CosmosDbDatabaseName"),
            Environment.GetEnvironmentVariable("CosmosDbContainerName")
        );

        var response = await container.UpsertItemAsync(student, new PartitionKey(student.StudentId));

        var okResponse = req.CreateResponse(System.Net.HttpStatusCode.OK);
        await okResponse.WriteAsJsonAsync(new
        {
            message = "Student profile uploaded successfully",
            id = student.Id,
            ruCharge = response.RequestCharge
        });
        return okResponse;
    }
}