package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.VidUpApp;
import com.mycompany.myapp.domain.Video;
import com.mycompany.myapp.repository.VideoRepository;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import static org.hamcrest.Matchers.hasItem;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


/**
 * Test class for the VideoResource REST controller.
 *
 * @see VideoResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = VidUpApp.class)
@WebAppConfiguration
@IntegrationTest
public class VideoResourceIntTest {


    private static final byte[] DEFAULT_UPLOAD_VIDEO = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_UPLOAD_VIDEO = TestUtil.createByteArray(2, "1");
    private static final String DEFAULT_UPLOAD_VIDEO_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_UPLOAD_VIDEO_CONTENT_TYPE = "image/png";
    private static final String DEFAULT_TITLE = "AAAAA";
    private static final String UPDATED_TITLE = "BBBBB";
    private static final String DEFAULT_DESCRIPTION = "AAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBB";

    private static final LocalDate DEFAULT_CREATED_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_CREATED_DATE = LocalDate.now(ZoneId.systemDefault());
    private static final String DEFAULT_AUTHOR = "AAAAA";
    private static final String UPDATED_AUTHOR = "BBBBB";

    @Inject
    private VideoRepository videoRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Inject
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    private MockMvc restVideoMockMvc;

    private Video video;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        VideoResource videoResource = new VideoResource();
        ReflectionTestUtils.setField(videoResource, "videoRepository", videoRepository);
        this.restVideoMockMvc = MockMvcBuilders.standaloneSetup(videoResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        video = new Video();
        video.setUploadVideo(DEFAULT_UPLOAD_VIDEO);
        video.setUploadVideoContentType(DEFAULT_UPLOAD_VIDEO_CONTENT_TYPE);
        video.setTitle(DEFAULT_TITLE);
        video.setDescription(DEFAULT_DESCRIPTION);
        video.setCreatedDate(DEFAULT_CREATED_DATE);
        video.setAuthor(DEFAULT_AUTHOR);
    }

    @Test
    @Transactional
    public void createVideo() throws Exception {
        int databaseSizeBeforeCreate = videoRepository.findAll().size();

        // Create the Video

        restVideoMockMvc.perform(post("/api/videos")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(video)))
                .andExpect(status().isCreated());

        // Validate the Video in the database
        List<Video> videos = videoRepository.findAll();
        assertThat(videos).hasSize(databaseSizeBeforeCreate + 1);
        Video testVideo = videos.get(videos.size() - 1);
        assertThat(testVideo.getUploadVideo()).isEqualTo(DEFAULT_UPLOAD_VIDEO);
        assertThat(testVideo.getUploadVideoContentType()).isEqualTo(DEFAULT_UPLOAD_VIDEO_CONTENT_TYPE);
        assertThat(testVideo.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testVideo.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testVideo.getCreatedDate()).isEqualTo(DEFAULT_CREATED_DATE);
        assertThat(testVideo.getAuthor()).isEqualTo(DEFAULT_AUTHOR);
    }

    @Test
    @Transactional
    public void checkUploadVideoIsRequired() throws Exception {
        int databaseSizeBeforeTest = videoRepository.findAll().size();
        // set the field null
        video.setUploadVideo(null);

        // Create the Video, which fails.

        restVideoMockMvc.perform(post("/api/videos")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(video)))
                .andExpect(status().isBadRequest());

        List<Video> videos = videoRepository.findAll();
        assertThat(videos).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkTitleIsRequired() throws Exception {
        int databaseSizeBeforeTest = videoRepository.findAll().size();
        // set the field null
        video.setTitle(null);

        // Create the Video, which fails.

        restVideoMockMvc.perform(post("/api/videos")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(video)))
                .andExpect(status().isBadRequest());

        List<Video> videos = videoRepository.findAll();
        assertThat(videos).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkAuthorIsRequired() throws Exception {
        int databaseSizeBeforeTest = videoRepository.findAll().size();
        // set the field null
        video.setAuthor(null);

        // Create the Video, which fails.

        restVideoMockMvc.perform(post("/api/videos")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(video)))
                .andExpect(status().isBadRequest());

        List<Video> videos = videoRepository.findAll();
        assertThat(videos).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllVideos() throws Exception {
        // Initialize the database
        videoRepository.saveAndFlush(video);

        // Get all the videos
        restVideoMockMvc.perform(get("/api/videos?sort=id,desc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(video.getId().intValue())))
                .andExpect(jsonPath("$.[*].uploadVideoContentType").value(hasItem(DEFAULT_UPLOAD_VIDEO_CONTENT_TYPE)))
                .andExpect(jsonPath("$.[*].uploadVideo").value(hasItem(Base64Utils.encodeToString(DEFAULT_UPLOAD_VIDEO))))
                .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE.toString())))
                .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
                .andExpect(jsonPath("$.[*].createdDate").value(hasItem(DEFAULT_CREATED_DATE.toString())))
                .andExpect(jsonPath("$.[*].author").value(hasItem(DEFAULT_AUTHOR.toString())));
    }

    @Test
    @Transactional
    public void getVideo() throws Exception {
        // Initialize the database
        videoRepository.saveAndFlush(video);

        // Get the video
        restVideoMockMvc.perform(get("/api/videos/{id}", video.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(video.getId().intValue()))
            .andExpect(jsonPath("$.uploadVideoContentType").value(DEFAULT_UPLOAD_VIDEO_CONTENT_TYPE))
            .andExpect(jsonPath("$.uploadVideo").value(Base64Utils.encodeToString(DEFAULT_UPLOAD_VIDEO)))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.createdDate").value(DEFAULT_CREATED_DATE.toString()))
            .andExpect(jsonPath("$.author").value(DEFAULT_AUTHOR.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingVideo() throws Exception {
        // Get the video
        restVideoMockMvc.perform(get("/api/videos/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateVideo() throws Exception {
        // Initialize the database
        videoRepository.saveAndFlush(video);
        int databaseSizeBeforeUpdate = videoRepository.findAll().size();

        // Update the video
        Video updatedVideo = new Video();
        updatedVideo.setId(video.getId());
        updatedVideo.setUploadVideo(UPDATED_UPLOAD_VIDEO);
        updatedVideo.setUploadVideoContentType(UPDATED_UPLOAD_VIDEO_CONTENT_TYPE);
        updatedVideo.setTitle(UPDATED_TITLE);
        updatedVideo.setDescription(UPDATED_DESCRIPTION);
        updatedVideo.setCreatedDate(UPDATED_CREATED_DATE);
        updatedVideo.setAuthor(UPDATED_AUTHOR);

        restVideoMockMvc.perform(put("/api/videos")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(updatedVideo)))
                .andExpect(status().isOk());

        // Validate the Video in the database
        List<Video> videos = videoRepository.findAll();
        assertThat(videos).hasSize(databaseSizeBeforeUpdate);
        Video testVideo = videos.get(videos.size() - 1);
        assertThat(testVideo.getUploadVideo()).isEqualTo(UPDATED_UPLOAD_VIDEO);
        assertThat(testVideo.getUploadVideoContentType()).isEqualTo(UPDATED_UPLOAD_VIDEO_CONTENT_TYPE);
        assertThat(testVideo.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testVideo.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testVideo.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
        assertThat(testVideo.getAuthor()).isEqualTo(UPDATED_AUTHOR);
    }

    @Test
    @Transactional
    public void deleteVideo() throws Exception {
        // Initialize the database
        videoRepository.saveAndFlush(video);
        int databaseSizeBeforeDelete = videoRepository.findAll().size();

        // Get the video
        restVideoMockMvc.perform(delete("/api/videos/{id}", video.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate the database is empty
        List<Video> videos = videoRepository.findAll();
        assertThat(videos).hasSize(databaseSizeBeforeDelete - 1);
    }
}
