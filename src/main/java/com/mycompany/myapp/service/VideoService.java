package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Video;
import com.mycompany.myapp.repository.VideoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.List;

/**
 * Service Implementation for managing Video.
 */
@Service
@Transactional
public class VideoService {

    private final Logger log = LoggerFactory.getLogger(VideoService.class);
    
    @Inject
    private VideoRepository videoRepository;
    
    /**
     * Save a video.
     * 
     * @param video the entity to save
     * @return the persisted entity
     */
    public Video save(Video video) {
        log.debug("Request to save Video : {}", video);
        Video result = videoRepository.save(video);
        return result;
    }

    /**
     *  Get all the videos.
     *  
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Transactional(readOnly = true) 
    public Page<Video> findAll(Pageable pageable) {
        log.debug("Request to get all Videos");
        Page<Video> result = videoRepository.findAll(pageable); 
        return result;
    }

    /**
     *  Get one video by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    @Transactional(readOnly = true) 
    public Video findOne(Long id) {
        log.debug("Request to get Video : {}", id);
        Video video = videoRepository.findOne(id);
        return video;
    }

    /**
     *  Delete the  video by id.
     *  
     *  @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete Video : {}", id);
        videoRepository.delete(id);
    }
}
